class Helper {
  formatTime(date, includeTime = false) {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'long',
      timeStyle: includeTime ? 'long' : undefined,
    }).format(new Date(date));
  }

  jsonParseValue(value) {
    try {
      return JSON.parse(value);
    } catch(_err) {
      return value;
    }
  }
  
  stringifyData(data) {
    try {
      return JSON.stringify(data);
    } catch(_err) {
      return data;
    }
  }
}
module.exports = new Helper();
