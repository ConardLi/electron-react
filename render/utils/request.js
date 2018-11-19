/**
 * TODO 待增加 request 和 response hook
 * 使用 nodejs 实现的 request
 *  1、增加了 success, error, complete 回调
 *  2、统一 get, form, json 传参 data 属性
 *  3、统一 response 结构
 *    success({ options, status: 0, data: any })
 *    error ({ options, status: 非0, msg: string })
 *  4、例：
 *    request(options); // 原始方式
 *    request.get|json|form({ // 快捷方式
 *      uri: 'http://www.xxx.com/api/test',
 *      data: {
 *        a: 1,
 *        b: [2, 3],
 *      },
 *      headers: {
 *        token: 'xxx-xxx',
 *      },
 *      success: (res) => {
 *      },
 *      error: (err) => {
 *      },
 *      complete: (res) => {
 *      },
 *    });
 */

import originRequest from 'request';
import baseUrl from '$config/base';

const MESSAGE = {
  302: '重定向异常，请稍后重试',
  401: '无效访问，请稍后重试',
  403: '接口无权限，请检查',
  404: '接口不存在，请检查',
  500: '服务器异常，请稍后重试',
};

/**
 * 使用参数回调函数fn，自动捕获脚本异常
 * @param {*} fn
 * @param {*} args
 */
const callback = (fn, ...args) => {
  try {
    if (fn) {
      fn(...args);
    }
  } catch (err) {
    console.log(err);
  }
};

function request(options) {
  // TODO 增加 request hook 处理
  const startTime = Date.now();
  options.uri = baseUrl + options.uri;
  delete options.data;
  originRequest(options, (err, response, body) => {
    // TODO 增加 response hook 处理
    let res;
    if (err) {
      res = {
        status: -1,
        msg: '网络异常，请检查网络',
        err, // TODO 确认是否可以 JSON 化
      };
    } else if (response.statusCode === 200) { // TODO 增加 2xx 处理
      if (typeof body === 'object') {
        res = body;
      } else {
        try {
          res = JSON.parse(body);
        } catch (e) {
          res = { status: -2, msg: '数据格式错误，请稍后重试' };
        }
      }
    } else {
      res = {
        status: response.statusCode,
        msg: MESSAGE[response.statusCode] || '服务异常，请稍后重试',
      };
    }
    res.options = options;
    const duration = Date.now() - startTime;
    console.log(duration, response);
    if (res.status === 0) {
      callback(options.success, res);
    } else {
      callback(options.error, res);
    }
    callback(options.complete, res);
  });
}

request.get = (options) => {
  request({
    method: 'GET',
    ...options,
    qs: options.data,
    useQuerystring: true, // 保证数组序列化为 a=1&a=2 而非 a[0]=1&a[1]=2
    json: true, // 保证 response body 自动 parse json
  });
}
request.json = (options) => {
  request({
    method: 'POST',
    ...options,
    body: options.data,
    json: true,
  });
}
request.form = (options) => {
  request({
    method: 'POST',
    ...options,
    form: options.data,
    useQuerystring: true,
    json: true,
  });
}

window.request = request; // 暴露方便调试和排查问题

export default request;