import express from 'express'

const app = express()
const port = 3000

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const bodyParser = require('body-parser')
const history = require('connect-history-api-fallback')
const cookieParser = require('cookie-parser')
const mariadb = require('mariadb')
const pool = mariadb.createPool({
  host: '127.0.0.1',
  user: '',
  password: '',
  database: 'blogdb',
  connectionLimit: 10
})
const multer = require('multer')
const path = require('path')
const uuid = require('uuid').v4
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: async (req, file, cb) => {
    const { originalname } = file
    // const ext = originalname + path.extname(file.originalname) // do uuid + rozszerzenie pliku
    const id = uuid()
    const filepath = `images/${id}-${originalname}`
    // console.log('Plik ' + filepath)
    let conn
    try {
      conn = await pool.getConnection()
      let sql = "INSERT INTO IMAGES SET IMAGE_NAME='" + filepath + "', CREATED=NOW();"
      await conn.query(sql)
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      if (conn) {
        conn.end()
      }
    }
    cb(null, filepath)
  }
})
const upload = multer({ storage })

// zamiana html na markdown
const TurndownService = require('turndown')
const turndownService = new TurndownService()

// zamiana markdown na html
const Showdown = require('showdown')
const converter = new Showdown.Converter()

// usunięcie znacznika <p> i </p> z początku i końca tekstu
function eraseParagraphTags(html) {
  if (html.slice(0, 3) == '<p>' && html.slice(html.length - 4, html.length) == '</p>') {
    return html.slice(3, -4)
  } else {
    return html
  }
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(history())
app.use(cookieParser('secretPassWithSomethingDIRTY'))

function createToken() {
  let time = new Date()
  return (
    'token' +
    (time.getMonth() + 1) +
    time.getFullYear() +
    (time.getHours() + 1) +
    (time.getMilliseconds() + 1)
  )
}

app.get('/login', async (req, res) => {
  let data = req.query

  if (req.signedCookies['preLoginID'] === undefined) {
    let conn
    try {
      conn = await pool.getConnection()
      let sql = "SELECT LOGIN, PFL, PLL FROM USER WHERE LOGIN='" + data.nickName + "';"
      const result = await conn.query(sql)
      if (result.length == 1) {
        if (result[0].PFL == data.first && result[0].PLL == data.last) {
          res.cookie('preLoginID', 'OK', {
            path: '/getToken',
            maxAge: 3000,
            signed: true,
            httpOnly: true
          })
          res.send('200')
        } else {
          console.log('login niepoprawne litery loginu V')
          res.send('401')
        }
      } else {
        console.log('login nie poprawny ')
        res.send('401')
      }
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      if (conn) conn.end()
    }
  } else {
    res.end()
  }
})

app.get('/getToken', async (req, res) => {
  // sprawdź z bd czy md5 od hasła zgadza się z przesłanymi danymi, jeśli tak to prześlij ciastko i token na 30 minut
  if (req.signedCookies['preLoginID'] == 'OK' && req.query.pass != '') {
    let data = req.query
    let conn
    try {
      conn = await pool.getConnection()
      let sql = "SELECT LOGIN, MD5(PASS) AS PMD5, ID FROM USER WHERE LOGIN='" + data.nickName + "';"
      const result = await conn.query(sql)
      if (result.length == 1) {
        let pass = result[0].PMD5
        let id = result[0].ID

        if (pass == data.pass) {
          let token = createToken()
          let sql2 =
            "UPDATE USER SET TOKEN='" +
            token +
            "', TCREATED=(SELECT NOW()), TVALID=TIMESTAMPADD(MINUTE, 30, NOW()) WHERE LOGIN='" +
            data.nickName +
            "' ;"
          await conn.query(sql2)
          res.cookie('session', token, { maxAge: 30 * 60 * 1000, httpOnly: true, signed: true })
          res.json({ status: '200', token: token, userId: id })
        } else {
          res.json({ status: '401' })
        }
      } else {
        res.json({ status: '401' })
      }
    } finally {
      if (conn) {
        conn.end
      }
    }
  } else {
    console.log('Unauthorised access')
  }
})

app.get('/update-token', async (req, res) => {
  // wyślij: {status 200, nowy token} , 401 wyczyść dane w bazie
  // sprawdź tokena w bazie
  // jeśli ok sprawdź tvalid
  // jeśli ok wyślij nowy token, status 200 i ciastko
  // jeśli nie wyczyść dane i wyślij status 401

  let oldToken = req.query.token
  let conn
  try {
    conn = await pool.getConnection()
    let sql =
      "SELECT TOKEN, TIMESTAMPDIFF(SECOND, NOW(), TVALID) AS TLEFT FROM USER WHERE TOKEN='" +
      oldToken +
      "';"
    let result = await conn.query(sql)
    if (result.length != 1) {
      res.json({ status: 401 })
    } else {
      if (result[0].TLEFT > 0) {
        let token = createToken()
        let sql2 =
          "UPDATE USER SET TOKEN='" +
          token +
          "', TCREATED=(SELECT NOW()), TVALID=TIMESTAMPADD(MINUTE, 30, NOW()) WHERE TOKEN='" +
          oldToken +
          "' ;"
        await conn.query(sql2)
        res.cookie('session', token, { maxAge: 30 * 60 * 1000, httpOnly: true, signed: true })
        res.json({ status: 200, token: token })
      } else {
        let sql2 =
          "UPDATE USER SET TCREATED=NULL, TVALID=NULL, TOKEN=NULL WHERE TOKEN='" + oldToken + "';"
        await conn.query(sql2)
        res.json({ status: 401 })
      }
    }
  } finally {
    if (conn) conn.end()
  }
})

app.get('/logout', async (req, res) => {
  let byeToken = req.query.token
  let byeCookie = req.signedCookies['session']
  let conn
  if (byeToken == byeCookie) {
    try {
      conn = await pool.getConnection()
      let sql =
        "UPDATE USER SET TOKEN=NULL, TCREATED=NULL, TVALID=NULL WHERE TOKEN='" + byeToken + "';"
      await conn.query(sql)
    } finally {
      if (conn) conn.end()
    }
  } else {
    res.send('401')
    res.send('Próba nieautoryzowanego dostępu')
  }
})

app.post('/save-article', async (req, res) => {
  let data = req.body.params
  let conn
  try {
    conn = await pool.getConnection()
    let markdownTitle = turndownService.turndown(data.title)
    let markdownIntro = turndownService.turndown(data.intro)
    let markdownContent = turndownService.turndown(data.content)
    let sql =
      'INSERT INTO ARTICLES( CREATED_AT, TITLE, INTRO, CONTENT, HERO_IMG, AUTHOR, EDIT, HIDDEN) VALUES(STR_TO_DATE("' +
      data.create_time +
      '", "%Y-%m-%dT%H:%i"), "' +
      markdownTitle +
      '", "' +
      markdownIntro +
      '", "' +
      markdownContent +
      '", "' +
      data.hero_img +
      '", "' +
      data.author +
      '", ' +
      data.edit +
      ', ' +
      data.hidden +
      ');'

    await conn.query(sql)

    if (data.edit) {
      let sql2 = "SELECT ARTICLE_ID FROM ARTICLES WHERE AUTHOR='" + data.author + "' AND EDIT=true;"
      let result = await conn.query(sql2)
      let articleId
      if (result.length == 1) {
        articleId = result[0].ARTICLE_ID

        let values = ''
        for (let i = 0; i < data.gallery.length; i++) {
          values += '("' + articleId + '", "' + data.gallery[i] + '"),'
        }
        values = values.slice(0, -1)

        let sql3 = 'INSERT INTO IMAGES_IN_GALLERY( ARTICLE_ID, IMAGE_ID) VALUES ' + values + ';'
        await conn.query(sql3)

        let sql4 = 'UPDATE ARTICLES SET EDIT=false WHERE ARTICLE_ID="' + articleId + '";'
        await conn.query(sql4)
      } else {
        console.log(
          'Więcej niż jeden artykuł autora o id ' +
            data.author +
            ' jest w trybie edycji, save-article'
        )
        res.send('Więcej niż jeden artykuł autora o id ' + data.author + ' jest w trybie edycji')
      }
    }
    res.send('Artykuł dodany')
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/update-article', async (req, res) => {
  let data = req.body.params
  let conn
  try {
    conn = await pool.getConnection()
    let markdownTitle = turndownService.turndown(data.title)
    let markdownIntro = turndownService.turndown(data.intro)
    let markdownContent = turndownService.turndown(data.content)
    let sql =
      'UPDATE ARTICLES SET TITLE="' +
      markdownTitle +
      '", INTRO= "' +
      markdownIntro +
      '", CONTENT= "' +
      markdownContent +
      '", HERO_IMG= ' +
      data.heroImgId +
      ', AUTHOR="' +
      data.author +
      '", EDIT= ' +
      data.edit +
      ', HIDDEN= ' +
      data.hidden +
      ', CREATED_AT= STR_TO_DATE("' +
      data.createTime +
      '", "%Y-%m-%dT%H:%i") WHERE ARTICLE_ID="' +
      data.id +
      '";'
    await conn.query(sql)
    res.send('Dokonano aktualizacji')
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/update-gallery', async (req) => {
  let articleId = req.body.params.articleId
  let dataArray = req.body.params.ids
  let conn
  try {
    conn = await pool.getConnection()
    // usunięcie poprzedniej galerii
    let sql2 = "DELETE FROM IMAGES_IN_GALLERY WHERE ARTICLE_ID='" + articleId + "';"
    await conn.query(sql2)
    // utworzenie bierzącej galerii
    let values = ''
    for (let i = 0; i < dataArray.length; i++) {
      values += '("' + articleId + '", "' + dataArray[i] + '"),'
    }
    values = values.slice(0, -1)
    let sql3 = 'INSERT INTO IMAGES_IN_GALLERY( ARTICLE_ID, IMAGE_ID) VALUES ' + values + ';'
    await conn.query(sql3)
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/save-gallery', async (req, res) => {
  let authorId = req.body.params.author
  let dataArray = req.body.params.ids
  let articleId
  let conn
  try {
    conn = await pool.getConnection()
    let sql = "SELECT ARTICLE_ID FROM ARTICLES WHERE AUTHOR='" + authorId + "' AND EDIT=true;"
    let result = await conn.query(sql)
    if (result.length == 1) {
      articleId = result[0].ARTICLE_ID
      // konstrukcja sql wprowadzającego galerię
      let values = ''
      for (let i = 0; i < dataArray.length; i++) {
        values += '("' + articleId + '", "' + dataArray[i] + '"),'
      }
      values = values.slice(0, -1)
      let sql2 = 'INSERT INTO IMAGES_IN_GALLERY( ARTICLE_ID, IMAGE_ID) VALUES ' + values + ';'
      await conn.query(sql2)

      let sql3 = 'UPDATE ARTICLES SET EDIT=false WHERE ARTICLE_ID="' + articleId + '";'
      await conn.query(sql3)
      res.send('Poprawnie zakończono edycję artykułu')
    } else {
      console.log(
        'Więcej niż jeden artykuł autora o id ' + authorId + ' jest w trybie edycji, save-gallery'
      )
    }
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/send-file', upload.single('jumbo'), (req, res) => {
  return res.send('Przesłano plik!')
})

app.post('/all-paths-to-images', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql =
      'SELECT IMAGES.IMAGE_NAME, IMAGES.CREATED, IMAGES.IMAGE_ID, PZ.COUNT_G, PG.COUNT_H FROM IMAGES LEFT JOIN (SELECT IMAGE_ID, COUNT(*) AS COUNT_G FROM IMAGES_IN_GALLERY GROUP BY IMAGE_ID) AS PZ ON IMAGES.IMAGE_ID = PZ.IMAGE_ID LEFT JOIN (SELECT HERO_IMG, COUNT(*) AS COUNT_H FROM ARTICLES GROUP BY HERO_IMG) AS PG ON IMAGES.IMAGE_ID = PG.HERO_IMG ORDER BY IMAGES.CREATED DESC;'
    let result = await conn.query(sql)
    let resultString = JSON.stringify(result, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
    res.send(resultString)
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.get('/delete-image', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql = 'SELECT IMAGE_NAME FROM IMAGES WHERE IMAGE_ID=' + req.query.id + ';'
    let result = await pool.query(sql)
    const filePath = 'uploads/' + result[0].IMAGE_NAME
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log('Błąd kasowania pliku ' + err)
      }
    })
    let sql2 = 'DELETE FROM IMAGES WHERE IMAGE_ID=' + req.query.id + ';'
    await conn.query(sql2)
    res.send('Poprawnie usunięto plik')
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/get-intro-articles', async (req, res) => {
  let conn
  let offset = req.body.params.offset
  let fetch = req.body.params.fetch
  try {
    conn = await pool.getConnection()
    let sql =
      'SELECT ARTICLES.ARTICLE_ID, ARTICLES.TITLE, ARTICLES.INTRO, ARTICLES.CREATED_AT, USER.LOGIN, IMAGES.IMAGE_NAME FROM ARTICLES INNER JOIN IMAGES ON ARTICLES.HERO_IMG=IMAGES.IMAGE_ID INNER JOIN USER ON ARTICLES.AUTHOR=USER.ID WHERE ARTICLES.HIDDEN=FALSE ORDER BY ARTICLES.ARTICLE_ID DESC OFFSET ' +
      offset +
      ' ROWS FETCH FIRST ' +
      fetch +
      ' ROWS ONLY;'
    let result = await conn.query(sql)
    for (let i = 0; i < result.length; i++) {
      let htmlTitle = converter.makeHtml(result[i].TITLE)
      let htmlIntro = converter.makeHtml(result[i].INTRO)
      let htmlFinalTitle = eraseParagraphTags(htmlTitle)
      let htmlFinalIntro = eraseParagraphTags(htmlIntro)
      result[i].TITLE = htmlFinalTitle
      result[i].INTRO = htmlFinalIntro
    }
    res.send(result)
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/get-intro-drafts', async (req, res) => {
  let conn
  let offset = req.body.params.offset
  let fetch = req.body.params.fetch
  try {
    conn = await pool.getConnection()
    let sql =
      'SELECT ARTICLES.ARTICLE_ID, ARTICLES.TITLE, ARTICLES.INTRO, ARTICLES.CREATED_AT, USER.LOGIN, IMAGES.IMAGE_NAME FROM ARTICLES INNER JOIN IMAGES ON ARTICLES.HERO_IMG=IMAGES.IMAGE_ID INNER JOIN USER ON ARTICLES.AUTHOR=USER.ID WHERE ARTICLES.HIDDEN=TRUE ORDER BY ARTICLES.ARTICLE_ID DESC OFFSET ' +
      offset +
      ' ROWS FETCH FIRST ' +
      fetch +
      ' ROWS ONLY;'
    let result = await conn.query(sql)
    for (let i = 0; i < result.length; i++) {
      let htmlTitle = converter.makeHtml(result[i].TITLE)
      let htmlIntro = converter.makeHtml(result[i].INTRO)
      let htmlFinalTitle = eraseParagraphTags(htmlTitle)
      let htmlFinalIntro = eraseParagraphTags(htmlIntro)
      result[i].TITLE = htmlFinalTitle
      result[i].INTRO = htmlFinalIntro
    }
    res.send(result)
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/get-entire-article', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql =
      "SELECT ARTICLES.TITLE, ARTICLES.INTRO, ARTICLES.CONTENT, ARTICLES.CREATED_AT, ARTICLES.HIDDEN, USER.LOGIN, IMAGES.IMAGE_NAME, IMAGES.IMAGE_ID FROM ARTICLES INNER JOIN IMAGES ON ARTICLES.HERO_IMG=IMAGES.IMAGE_ID INNER JOIN USER ON ARTICLES.AUTHOR=USER.ID WHERE ARTICLES.ARTICLE_ID = '" +
      req.body.params.articleId +
      "';"
    let result = await conn.query(sql)
    // konwersja tytułu, intro, treści do html, obcięcie <p></p> z tytułu i intro
    let htmlTitle = converter.makeHtml(result[0].TITLE)
    let htmlIntro = converter.makeHtml(result[0].INTRO)
    let htmlContent = converter.makeHtml(result[0].CONTENT)
    let htmlFinalTitle = eraseParagraphTags(htmlTitle)
    let htmlFinalIntro = eraseParagraphTags(htmlIntro)
    result[0].TITLE = htmlFinalTitle
    result[0].INTRO = htmlFinalIntro
    result[0].CONTENT = htmlContent
    res.send(result)
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/get-gallery', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql =
      "SELECT IMAGES.IMAGE_NAME, IMAGES.IMAGE_ID FROM IMAGES INNER JOIN IMAGES_IN_GALLERY ON IMAGES.IMAGE_ID=IMAGES_IN_GALLERY.IMAGE_ID WHERE IMAGES_IN_GALLERY.ARTICLE_ID='" +
      req.body.params.articleId +
      "';"
    let result = await conn.query(sql)
    res.send(result)
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/get-approved-comments', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql =
      "SELECT COMMENT_ID, AUTHOR, CREATED_AT, CONTENT FROM COMMENTS WHERE APPROVED=true AND ARTICLE_ID='" +
      req.body.params.articleId +
      "';"
    let result = await conn.query(sql)
    for (let i = 0; i < result.length; i++) {
      let htmlAuthor = converter.makeHtml(result[i].AUTHOR)
      let htmlContent = converter.makeHtml(result[i].CONTENT)
      let htmlFinalAuthor = eraseParagraphTags(htmlAuthor)
      let htmlFinalContent = eraseParagraphTags(htmlContent)
      result[i].AUTHOR = htmlFinalAuthor
      result[i].CONTENT = htmlFinalContent
    }
    res.send(result)
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/send-comment', async (req, res) => {
  let conn
  let data = req.body.params
  try {
    conn = await pool.getConnection()
    let markdownAuthor = turndownService.turndown(data.author)
    let markdownContent = turndownService.turndown(data.text)
    let sql =
      "INSERT INTO COMMENTS(ARTICLE_ID, AUTHOR, CREATED_AT, APPROVED, TRASHED, CONTENT) VALUES ('" +
      data.articleId +
      "', '" +
      markdownAuthor +
      "', NOW(), false, false, '" +
      markdownContent +
      "');"
    await conn.query(sql)
    res.send('Komentarz powinien pojawić się wkrótce')
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/get-all-comments', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql =
      'SELECT COMMENT_ID, AUTHOR, CREATED_AT, APPROVED, TRASHED, CONTENT FROM COMMENTS WHERE ARTICLE_ID="' +
      req.body.params.articleId +
      '";'
    let result = await conn.query(sql)
    for (let i = 0; i < result.length; i++) {
      let htmlAuthor = converter.makeHtml(result[i].AUTHOR)
      let htmlContent = converter.makeHtml(result[i].CONTENT)
      let htmlFinalAuthor = eraseParagraphTags(htmlAuthor)
      let htmlFinalContent = eraseParagraphTags(htmlContent)
      result[i].AUTHOR = htmlFinalAuthor
      result[i].CONTENT = htmlFinalContent
    }
    res.send(result)
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/get-unauthorised-comments', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql =
      'SELECT COMMENTS.COMMENT_ID, COMMENTS.AUTHOR, COMMENTS.CREATED_AT, COMMENTS.CONTENT, ARTICLES.TITLE, ARTICLES.INTRO FROM COMMENTS INNER JOIN ARTICLES ON COMMENTS.ARTICLE_ID = ARTICLES.ARTICLE_ID WHERE COMMENTS.APPROVED=false AND COMMENTS.TRASHED=false;'
    let result = await conn.query(sql)
    for (let i = 0; i < result.length; i++) {
      let htmlAuthor = converter.makeHtml(result[i].AUTHOR)
      let htmlContent = converter.makeHtml(result[i].CONTENT)
      let htmlTitle = converter.makeHtml(result[i].TITLE)
      let htmlIntro = converter.makeHtml(result[i].INTRO)
      let htmlFinalAuthor = eraseParagraphTags(htmlAuthor)
      let htmlFinalContent = eraseParagraphTags(htmlContent)
      let htmlFinalTitle = eraseParagraphTags(htmlTitle)
      let htmlFinalIntro = eraseParagraphTags(htmlIntro)
      result[i].AUTHOR = htmlFinalAuthor
      result[i].CONTENT = htmlFinalContent
      result[i].TITLE = htmlFinalTitle
      result[i].INTRO = htmlFinalIntro
    }
    res.send(result)
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.get('/approve-comment', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql = "UPDATE COMMENTS SET APPROVED=true WHERE COMMENT_ID='" + req.query.commentId + "';"
    await conn.query(sql)
    res.send('Zatwierdzono komentarz')
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.get('/move-comment-to-trash', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql = "UPDATE COMMENTS SET TRASHED=true WHERE COMMENT_ID='" + req.query.commentId + "';"
    await conn.query(sql)
    res.send('Komentarz przeniesiono do kosza')
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/get-trashed-comments', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql =
      'SELECT COMMENT_ID, AUTHOR, CREATED_AT, CONTENT, APPROVED FROM COMMENTS WHERE TRASHED=true;'
    let result = await conn.query(sql)
    for (let i = 0; i < result.length; i++) {
      let htmlAuthor = converter.makeHtml(result[i].AUTHOR)
      let htmlContent = converter.makeHtml(result[i].CONTENT)
      let htmlFinalAuthor = eraseParagraphTags(htmlAuthor)
      let htmlFinalContent = eraseParagraphTags(htmlContent)
      result[i].AUTHOR = htmlFinalAuthor
      result[i].CONTENT = htmlFinalContent
    }
    res.send(result)
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.get('/un-approve-comment', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql = 'UPDATE COMMENTS SET APPROVED=false WHERE COMMENT_ID="' + req.query.commentId + '";'
    await conn.query(sql)
    res.send('Usunięto zatwierdzenie komentarza')
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.get('/restore-comment', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql = 'UPDATE COMMENTS SET TRASHED=false WHERE COMMENT_ID="' + req.query.commentId + '";'
    await conn.query(sql)
    res.send('Przywrócono komentarz')
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.get('/erase-comment', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql = 'DELETE FROM COMMENTS WHERE COMMENT_ID="' + req.query.commentId + '";'
    await conn.query(sql)
    res.send('Usunięto komentarz')
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) {
      conn.end()
    }
  }
})

app.post('/email', (req, res) => {
  console.log(req.header('Content-Type'))
  console.log(req.body.params.email)
  console.log(req.body.params.text)

  res.end('Otrzymano wiadomość')
})

app.use(express.static('dist'))
app.use('/uploads', express.static(path.join('uploads')))

// app.get('/', (req, res) => {
//   res.send('index.html')
// })

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`)
})
