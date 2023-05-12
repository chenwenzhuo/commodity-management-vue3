export function timeFormatter(milliseconds: number | undefined): string {
    if (milliseconds === undefined)
        return '';//参数为空则返回空字符串

    const date = new Date(milliseconds);
    const year = date.getFullYear();//年
    const month = date.getMonth() + 1;//月
    const day = date.getDate();//日
    const hour = date.getHours();//小时
    const minute = date.getMinutes();//分钟
    const second = date.getSeconds();//秒

    return `${year}/${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day} ` +
        `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`;
}