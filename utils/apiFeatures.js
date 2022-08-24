class ApiFeatures {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            },
            'details.scheduleType': {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}

        console.log(keyword)

        this.query = this.query.find({...keyword})
        return this
    }

    // http://localhost:4000/mag/pos/rawMaterial?keyword=anjing&page=1
    
    filter(){
        const queryCopy = {...this.queryStr}

        // Removing some fields for category
        const removeFields = ["Keyword", "page", "limit"]

        removeFields.forEach((key) => delete queryCopy[key])

        // Filter for Price and Rating
        console.log(queryCopy)

        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

        this.query = this.query.find(JSON.parse(queryStr))
        console.log(queryCopy)
        return this
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1 //50 - 10
        const skip = resultPerPage * (currentPage - 1)
        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}

module.exports = ApiFeatures