// @ts-check
import * as React from 'react'
import {createPost} from '@/app/(community)/actions'
import { SubmitButton } from '@/components/client/buttons';
import { BiUpload } from 'react-icons/bi';

const isDev = process.env.NODE_ENV === 'development'

export default function SubmitBlog() {
    if(!isDev) return null
    return       <div>
    {/* <h2>新建文章</h2> */}
    <form className="" action={createPost}>
      <input
        type="file"
        name="post"
        id="post"
        accept=".mdx"
        defaultValue=""
      />
      <label htmlFor="post" className=' inline-flex items-center'><BiUpload /> </label>
      <SubmitButton className=" px-2">保存</SubmitButton>
    </form>
  </div>;
}
