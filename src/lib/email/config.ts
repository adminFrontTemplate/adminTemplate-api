const { EMAILALIAS, EMAILHOST, EMAILUSER, EMAILPASS } = process.env;

export const EMAIL = {
  // 别名，自己定义
  alias: EMAILALIAS,
  // 邮件服务器地址
  host: EMAILHOST,
  // 邮件服务器端口
  port: 465,
  // 是否使用默认465端口
  secure: true,
  // 你的邮箱
  user: EMAILUSER,
  // 你的授权码
  pass: EMAILPASS,
};

export const emailType = {
  register: 'register',
  forget: 'forget',
};
