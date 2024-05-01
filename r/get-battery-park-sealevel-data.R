## Function to move columns
# see:
# https://stackoverflow.com/questions/22286419/move-a-column-to-first-position-in-a-data-frame
# https://stackoverflow.com/questions/3369959/moving-columns-within-a-data-frame-without-retyping
#
# options: first, last, before, after
#
# examples:
# mydf <- data.frame(matrix(1:12, ncol = 4))
# mydf.cols <- moveme(names(mydf), "X4 first")
# mydf2 <- mydf[, mydf.cols]
#
# mydf.cols <- moveme(names(mydf), "X1 last")
# mydf.cols <- moveme(names(mydf), "X2 before X1; X4 before X3")
#
moveme <- function (invec, movecommand) {
    movecommand <- lapply(strsplit(strsplit(movecommand, ";")[[1]],
                                   ",|\\s+"), function(x) x[x != ""])
    movelist <- lapply(movecommand, function(x) {
        Where <- x[which(x %in% c("before", "after", "first",
                                  "last")):length(x)]
        ToMove <- setdiff(x, Where)
        list(ToMove, Where)
    })
    myVec <- invec
    for (i in seq_along(movelist)) {
        temp <- setdiff(myVec, movelist[[i]][[1]])
        A <- movelist[[i]][[2]][1]
        if (A %in% c("before", "after")) {
            ba <- movelist[[i]][[2]][2]
            if (A == "before") {
                after <- match(ba, temp) - 1
            }
            else if (A == "after") {
                after <- match(ba, temp)
            }
        }
        else if (A == "first") {
            after <- 0
        }
        else if (A == "last") {
            after <- length(myVec)
        }
        myVec <- append(temp, values = movelist[[i]][[1]], after = after)
    }
    myVec
}


#### Get Battery Park, NY sea level data
# 1. get from URL
# 2. remove footer, keep data only
# 3. create dataframe
# 4. change column names
# 5. create date column ("Date") from Year and Month, format as YYYY-MM-DD
# 6. move Date to first column, requires moveme() function to be loaded, see below
# 7. save as CSV
# TODO: drop Year and Mo columns, move Date to 1st column, rename headers
install.packages("RCurl")
library("RCurl")
sealevel.raw <- getURL("https://tidesandcurrents.noaa.gov/sltrends/data/8518750_meantrend.txt")
sealevel.nodescr <- substr(sealevel.raw, regexpr("\n\n", sealevel.raw), nchar(sealevel.raw))
sealevel.data <- substr(sealevel.nodescr, 3, nchar(sealevel.raw))
rm(sealevel.raw)
rm(sealevel.nodescr)
sealevel.monthly <- read.table(textConnection(sealevel.data), header = TRUE)
rm(sealevel.data)
names(sealevel.monthly) <- c("Year", "Month",
"Monthly_MSL", "Linear_Trend", "High_Conf","Low_Conf")
# Concatenate the Year and Month columns into a Date column (Y-m-d), with the day being the 1st of the month.
sealevel.monthly$Date <- as.Date(paste(sealevel.monthly$Year, sealevel.monthly$Month, 1, sep = "-"), "%Y-%m-%d")
# Delete the Year and Month columns
sealevel.monthly = subset(sealevel.monthly, select = -c(Year,Month))
sealevel.rearranged.columns <- moveme(names(sealevel.monthly), "Date first")
sealevel.monthly <- sealevel.monthly[, sealevel.rearranged.columns]
rm(sealevel.rearranged.columns)
names(sealevel.monthly) <- c("Year", "Monthly_MSL", "Linear_Trend", "High_Conf","Low_Conf")
# write.csv(uah.monthly, file = "~/Development/R/uah-monthly-all.csv", row.names = FALSE)
write.csv(sealevel.monthly, file = "~/Dev/Node/plotly-practice-1/noaa_battery_park_ny_meantrend-dates.csv", row.names = FALSE)

