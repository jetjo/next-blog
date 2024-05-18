"use client";
import type { IBLog } from "@db/blog-model";

import { memo, useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { FaTags } from 'react-icons/fa6'
import { FaRegEdit, FaRegSave } from 'react-icons/fa'
// 分子结构, correlate
import { SiMoleculer } from "react-icons/si";
import { IoMdAdd } from "react-icons/io";
import { tagDiff } from "@db/blog-model";
import { getRelatedTags, updatePost } from "@/app/(community)/actions";
import style from './tag.module.css'

const Tags = memo(function Tags({ post, matchedTags }: { post: IBLog, matchedTags?: string[] }) {

    const [isEditing, setIsEditing] = useState(false);

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const onDialogOpen = () => {
            // console.log('打开对话框!');
            document.documentElement.style.overflowY = 'hidden';
        }
        const onDialogClose = () => {
            // console.log('关闭对话框!');
            document.documentElement.style.overflowY = 'auto';
        }
        // console.log('dialogRef.current???', !!dialogRef.current);

        dialogRef.current?.addEventListener('open', onDialogOpen)
        dialogRef.current?.addEventListener('close', onDialogClose)
        return () => {
            dialogRef.current?.removeEventListener('open', onDialogOpen)
            dialogRef.current?.removeEventListener('close', onDialogClose)
        }
    }, [])

    return (
        <div className={clsx(style.tagBox)}>
            <div className={clsx(style.header, ' flex justify-between items-center ')}>
                <div className={clsx('flex items-center gap-1')}>
                    <i><FaTags /></i>
                    <h2>标签</h2>
                </div>
                <ul className={clsx(' flex items-center gap-2')}>
                    <li> <a className={clsx(style.editBtnInHead, ' inline-block relative active:bg-slate-200 dark:active:bg-slate-500 ')}
                        title='编辑'
                        onClick={(e) => {
                            e.preventDefault();
                            // setIsEditing(true)
                            dialogRef.current?.showModal();
                            dialogRef.current?.dispatchEvent(new Event('open'))
                        }} > <FaRegEdit /> </a> </li>
                </ul>
            </div>
            <div className={clsx(' px-3 lg:px-7 flex flex-wrap gap-5 ')}>
                {post?.tags.map((t, i) => (<Tag key={i} isEditing={isEditing}>{t}</Tag>))}
                {/* {isEditing && <AddTag onOpen={
                    () => {
                        dialogRef.current?.showModal();
                    }
                } />} */}
            </div>
            <dialog ref={dialogRef}>
                <AddTagForm blog={post} matchedTags={matchedTags} onChange={async (tags) => {
                    dialogRef.current?.close();
                    console.log(tags);
                    await updatePost({ blog: post, tags });
                }} />
            </dialog>
        </div>)
})

const Tag = memo(({ children, isEditing }: any) => {
    return (
        <span
            className={clsx(
                style.tagBtn,
                ' inline-block min-w-[3em] ',
                isEditing ? 'border' : 'border-none'
            )}
        >
            {children}
        </span>)
})

const AddTag = ({ onOpen }: { onOpen: () => void }) => {
    return (
        <a
            title="新增"
            className={clsx(
                "cursor-pointer active:bg-slate-200 dark:active:bg-slate-500",
                ' inline-block rounded-full p-2 border-[color:inherit]',
                'border'
            )}
            onClick={(e) => {
                e.preventDefault();
                console.log('新增');
                onOpen();
            }}
        >
            <IoMdAdd />
        </a>)
}

const TagPanel = memo(({ tags, inputedTags = [], withSelectAll = false, onChange }: { tags: string[], inputedTags?: string[] & { mode?: 'add' | 'search' }, withSelectAll?: boolean, onChange: (tags: string[]) => void }) => {
    const [innerTags, setInnerTags] = useState((tagDiff(tags, inputedTags)).map(tag => ({ __proto__: null, tag, checked: withSelectAll })).concat(inputedTags.map(tag => ({ __proto__: null, tag, checked: true, inputed: true }))))
    useEffect(() => {
        const mode = inputedTags.mode || 'add';
        inputedTags = [...new Set(inputedTags)];
        if (!inputedTags || !inputedTags.length) return;
        const map = innerTags.map((i, idx) => ({ __proto__: null, [i.tag]: { ...i, idx } })).reduce((res, cur) => (Object.assign(res, cur), res), Object.create(null))
        const newInnerTags = [...innerTags]
        let flag = false;
        for (const input of inputedTags) {
            if (Object.hasOwn(map, input)) {
                const t = map[input];
                if (!t || t.checked) continue;
                newInnerTags[t.idx!] = { __proto__: null, tag: t.tag, checked: mode === 'add' }
                flag = true;
                continue;
            }
            newInnerTags.push({ __proto__: null, tag: input, checked: true })
            flag = true;
        }
        if (flag) {
            setInnerTags(newInnerTags);
            onChange(newInnerTags.filter(t => t.checked).map(t => t.tag));
        }
    }, [inputedTags])
    return (<div className={clsx('flex flex-wrap gap-5')}>
        {innerTags.map(({ tag, checked }, i) => {
            return (
                <label key={tag}>{tag}
                    <input type="checkbox" name="select-tags" value={tag} checked={checked}
                        className=" form-checkbox"
                        onChange={() => {
                            const tags = innerTags.slice(0, i).concat([{ __proto__: null, tag, checked: !checked }]).concat(innerTags.slice(i + 1));
                            setInnerTags(tags)
                            onChange(tags.filter(t => t.checked).map(t => t.tag));
                        }}
                    />
                </label>
            )
        })}
    </div>)
})

const AddTagForm = memo(({ blog, matchedTags = [], onChange }: { blog: IBLog, matchedTags?: string[], onChange: (tags: string[]) => void }) => {
    // console.log({ blog, matchedTags });

    const allTags = [...new Set([
        ...matchedTags,
        // '吃饭','睡觉','打豆豆','旅行','看电影','登山','钓鱼','野游','野炊','打野兔','狩猎','摸鱼','冲浪','...'
    ])]
    const formId = useId();

    const [inputedTags, setInputedTags] = useState<string[] & { mode?: 'add' | 'search' }>([])

    const inputRef = useRef<HTMLInputElement>(null);

    const [selectedTags, setSelectedTags] = useState([[...blog.tags], []])

    const getInputedTags = () => {
        const news = inputRef.current?.value.split(',')
        if (news && news.length) {
            return tagDiff(news, blog.tags).filter(t => t.length > 1);
        }
        return []
    }

    const handleCustomAdd = () => {
        setInputedTags(getInputedTags())
    }

    const handleRelateSearch = async () => {
        const tags = getInputedTags();
        if (tags.length) {
            const _relates = await getRelatedTags({ tags });
            const res = tagDiff(_relates, blog.tags);
            // @ts-ignore
            res.mode = 'search';
            setInputedTags(res);
            return;
        }
        setInputedTags([]);
    }
    return (
        <div className={' flex flex-col items-stretch'}>
            <header className={style.dialogHeader}>
                <h2>编辑文章标签</h2>
            </header>
            <form>
                <div style={{ maxHeight: 'calc(100vh - 10em)' }} className={' overflow-y-auto'}>
                    <div className={clsx(style.ediTagForm, 'max-w-3xl flex flex-col gap-10 items-stretch')}>
                        <fieldset>
                            <legend>当前的标签</legend>
                            <TagPanel tags={blog.tags}
                                withSelectAll
                                onChange={(tags) => {
                                    setSelectedTags([tags, selectedTags[1]])
                                }} />
                        </fieldset>

                        <fieldset>
                            <legend>自定义标签</legend>
                            {/* <label htmlFor={`${formId}-new-tag`}>创建标签: </label> */}
                            <div className={clsx('flex items-end')}>
                                <input
                                    ref={inputRef}
                                    className={clsx(style.tagInput, 'flex-1', 'form-input')}
                                    id={`${formId}-new-tag`}
                                    aria-describedby={`${formId}-new-tag-hint`}
                                    placeholder="请输入标签, 逗号分隔, 回车提交~"
                                    onKeyDown={(e) => {
                                        const { code, key, keyCode, charCode, target } = e;
                                        const inputEle = target as HTMLInputElement
                                        // console.log({ code, key })
                                        if (code === 'Enter') {
                                            e.preventDefault(); //阻止表单提交及对话框关闭
                                            // const news = inputEle.value.split(',')
                                            handleCustomAdd();
                                        }
                                    }}
                                    type="text" />
                                <button type="button" className={clsx(
                                    style.tagInputBtn,
                                    "text-black",
                                    "opacity-85",
                                    "hover:opacity-100"
                                )}> <a href="" title="添加"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleCustomAdd();
                                    }}
                                >
                                        <IoMdAdd />
                                    </a> </button>
                                <button type="button" className={clsx(
                                    style.tagInputBtn,
                                    "text-black",
                                    "opacity-85",
                                    "hover:opacity-100"
                                )}> <a href="" title="搜索相关标签"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleRelateSearch();
                                    }}
                                >
                                        <SiMoleculer />
                                    </a> </button>
                            </div>
                            {/* @ts-ignore */}
                            <p hint="" id={`${formId}-new-tag-hint`} >标签不能包含空格,最多5个字!</p>
                        </fieldset>

                        <fieldset>
                            <legend>选择已有标签</legend>
                            <TagPanel tags={allTags}
                                inputedTags={inputedTags}
                                onChange={(tags) => {
                                    setSelectedTags([selectedTags[0], tags]);
                                }} />
                        </fieldset>

                        <p className={clsx(style.actionBox, 'flex items-center gap-8 justify-end')}>
                            <button value='cancel' formMethod="dialog">取消</button>
                            <button value='confirm' onClick={(e) => {
                                e.preventDefault();
                                onChange([...new Set(selectedTags.flat(2))]);
                            }}
                            >确认</button>
                        </p>
                    </div>
                </div>
            </form>
        </div>)
})

export default Tags;