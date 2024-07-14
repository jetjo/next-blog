"use server";

export async function search(preResult: any, form: FormData): Promise<any> {
    const q = form.get('q')
    console.log(q, '查询参数!');
}