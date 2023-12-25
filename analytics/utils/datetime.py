import datetime


def get_timestamp_of_current_weekday(weekday: int, time: datetime.time):
    today = datetime.date.today()
    current_day = today.weekday()

    diff = weekday-current_day
    days_till_weekday = diff if diff >= 0 else 7+diff

    actual_date = today + datetime.timedelta(days=days_till_weekday)
    timestamp = datetime.datetime.combine(actual_date, time).timestamp()
    return timestamp
