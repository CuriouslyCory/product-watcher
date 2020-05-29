module.exports = [
    {
        id: 'Vitacost-Bobs-Bread-Flour',
        url: 'https://www.vitacost.com/bobs-red-mill-artisan-bread-flour-unbleached-enriched',
        selector: '.pBuyMsgOOS',
        contains: /Out of stock/,
        notificationMsg: 'Vitacost Bob\'s Red Mill Flour in stock!'
    },
    {
        id: 'KingArthur-AP-5lb',
        url: 'https://shop.kingarthurflour.com/items/king-arthur-unbleached-all-purpose-flour-5-lb',
        selector: '#boMessage',
        contains: /Item is temporarily unavailable/,
        notificationMsg: 'King Arthur AP Flour in stock!'
    },
    {
        id: 'Reel-Paper-TP',
        url: 'https://reelpaper.com/',
        selector: '.announcement-bar',
        contains: /TEMPORARILY SOLD OUT/,
        notificationMsg: 'Reel TP is in stock!'
    },
    
]