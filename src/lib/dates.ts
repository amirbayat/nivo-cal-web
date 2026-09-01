// هفته‌ی ایرانی از شنبه شروع می‌شه؛ Date.getDay() طبق استاندارد جاوااسکریپت از یکشنبه=0
// شروع می‌شه، پس با این نگاشت (شنبه=6 -> جایگاه ۰) روزها رو طوری می‌چینیم که شنبه همیشه
// اول آرایه باشه — با flex-row زیر RTL یعنی همیشه سمت راست. هم‌راستا با نیوو کال موبایل.
export function saturdayFirstIndex(dateStr: string): number {
  return (new Date(dateStr).getDay() + 1) % 7
}
