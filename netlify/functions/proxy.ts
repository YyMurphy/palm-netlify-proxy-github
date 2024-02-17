// 导入 Context 类型定义
import { Context } from "@netlify/edge-functions";

// 定义一个异步函数作为默认导出
export default async (request: Request, context: Context) => {
    // 从请求中获取 URL
    const _url = new URL(request.url);
    // 保存原始主机名
    const originalHostname = _url.hostname;

    // 将 URL 的主机名更改为 "github.com"
    _url.hostname = "github.com";
    // 创建一个新的请求对象，其 URL 已更改为 "github.com"
    const req = new Request(_url, request);
    // 设置请求头的 'origin' 字段为 'https://github.com'
    req.headers.set('origin', 'https://github.com');
    
    // 使用 fetch API 发送请求，并等待响应
    // 在请求的 URL 前加上代理服务的 URL
    const res = await fetch('https://cors-anywhere.herokuapp.com/' + req.url); // 修改了这一行
    // 创建一个新的响应对象，其主体和状态与原始响应相同
    let newRes = new Response(res.body, res);

    // 从响应头中获取 'location' 字段
    let location = newRes.headers.get('location');
    // 如果 'location' 字段存在且不为空
    if (location !== null && location !== "") {
      // 将 'location' 字段中的 '://github.com' 替换为原始主机名
      location = location.replace('://github.com', '://' + originalHostname);
      // 设置新响应的 'location' 字段
      newRes.headers.set('location', location);
    }
    // 返回新的响应对象
    return newRes;
};
