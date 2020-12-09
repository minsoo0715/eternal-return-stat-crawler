const cheerio = require('cheerio');
const getHtml = require('./getHtml')


const Service = (name, mode) => {
    return new Promise(resolve => {
        var list = {
            most_played: [],
            winnum: null,
            avgrank: null,
            avgkill: null,
            avgchrank: [],
            match: null
        };
        
        getHtml("KR", "OPEN", name, mode).then(response => {
            
            let html = response.data.result.output;
            const $ = cheerio.load(html);
        
            try{
                const $MostList = $("div.row.container").children("div.columns");    
        
                $MostList.each(function(i, elem) {
        
                    list.most_played.push( {
                        name: $(this).find('h1.card_title').text(),
                        count: $(this).find('p.title').text(),
                        top3: $(this).find('p.subtitle').text().replace(/\(3위 안에 든 횟수: /, "").replace(/\)/, "")
                    })
                    
        
                })
        
        
            }catch(e) {
                console.error(e)
            }
        
            try{
                const $ETCList_value = $("h4");
        
                const ETC_name = ["최종 우승 횟수", "평균 순위", "평균 킬"];
                let ETCLIST = {};
        
        
                $ETCList_value.each(function(i, elem) {
                    let text = $(this).find("i").text();
        
                    if(text != "") {
                        ETCLIST[ETC_name[i++]] = text;
                    
                        }
                    
                })
                list.winnum = ETCLIST['최종 우승 횟수']
                list.avgrank = ETCLIST['평균 순위']
                list.avgkill = ETCLIST['평균 킬']
        
            }catch(e) {
                console.error(e)
            }
        
            try{
                const $chList = $("div.grid").children("div");
                
                $chList.each(function(i, elem) {
                    let text = $(this).find("h4").text()
                    if(text !="") {
                    let temp = text.replace(/: |최다 킬| \(|\)/g, "-").split(/-{1,3}/)
                    list.avgchrank.push({
                        chname: temp[0],
                        avgrank: temp[1],
                        maxkill: temp[2]
                    });
                    }
                })
        
            }catch(e) {
                console.error(e);
            }
        
            // try{
            //     const $matchList = $("div.gamecolumns.container").children("div.gamecard");
            //     $matchList.each(function(i, elem) {
            //         console.log($(this).find("b").text().substring(0,24));
            //     })
            // }catch(e) {
            //     console.error(e);
            // }
        
            // try{
            //     const $etcList = $("div.gamecolumns.container").children("div.gamecard").children("table.tablecontainer.center.border").children("tbody").children("tr").find("td.tdborder");
            //     $etcList.each(function(i, elem) {
            //         console.log("||",$(this).find("a").text(), "||");
            //     })
        
        
            // }catch(e) {
            //     console.error(e);
            // }
            let rawlist = [];
            let rawlist_2 = [];
            let etcList = [];
        
            try{
                const $etcList = $("div.gamecolumns.container").children("div.gamecard").children("table.tablecontainer.center.border").children("tbody").children("tr").children('td[rowspan="6"]')
                $etcList.each(function(i, elem) {
                    if($(this).children().length == 0) {
                     rawlist.push($(this).text());
                    }else{
                        rawlist_2.push($(this).text().replace(/ /gi, ""));
                    }
                })
        
        
                for(let i = 0; i<rawlist.length; i+=3) {
                    let temp = {
                        level: rawlist[i],
                        kill: rawlist[i+1],
                        anikill: rawlist[i+2]
                    }
                    etcList.push(temp);
                }
        
                for(let i = 0; i*2+1<rawlist_2.length; i++) {
                    
                    etcList[i]['ch'] = rawlist_2[i*2];
                    etcList[i]['rank'] = rawlist_2[i*2+1];
                }
        
        
               list.match=etcList;
            }catch(e) {
                throw e;
            }
        
            
        
            

            resolve(list);

        })
    })

}

module.exports = Service;
