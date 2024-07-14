import { BlogModel, MDXContentModel, IMDXContentDoc, ChangeStreamDocument } from "@db/blog-model";
import jsdom from 'jsdom'

const { JSDOM } = jsdom
const articleHost = process.env.articleHost;

const onChange = (blog: IMDXContentDocDiff) => {
    // console.log({ blog })
    // 发起get请求获取页面的html文本
    // fetch(`http://localhost:3000/en-US/post/${blog.fullDocument.blogId}?p&v`).then(res => res.text()).then(html => {
    //     console.log(html)
    // }).catch(err => {
    //     console.error(err)
    // })
    const articleUrl = `${articleHost}/en-US/post/${blog.fullDocument.blogId}?p&v`
    console.log({ articleUrl });

    JSDOM.fromURL(articleUrl).then(dom => {
        // console.log(dom.serialize())
        // const ps = [...dom.window.document.querySelectorAll('article p')]
        // ps.forEach(p => console.log(p.textContent))

        const article = dom.window.document.querySelector('article').textContent;
        console.log(article)
    }).catch(err => {
        console.error(err)
    })
}

type IMDXContentDocDiff = ChangeStreamDocument<IMDXContentDoc> & { fullDocument: IMDXContentDoc }

MDXContentModel.watch<IMDXContentDoc, IMDXContentDocDiff>().on('change', blog => onChange(blog))
