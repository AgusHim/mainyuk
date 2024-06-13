import { format, parseISO } from "date-fns";

 function formatStrToDateTime(dateStr: string, formatStr:string) {
    let date = parseISO(dateStr);
    let newDate = date.setHours(
      date.getHours() - 7,
      date.getMinutes(),
      date.getSeconds()
    );
    return format(newDate, formatStr);
  }


  export {formatStrToDateTime}