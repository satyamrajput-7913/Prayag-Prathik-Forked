// sampleData.js
const touristSpots = [
    {
        name: "Anand Bhavan",
        location: { type: "Point", coordinates: [81.8599815, 25.459376] },
        type: "tourist_spot",
        time: {
            monday: "10:00 AM - 1:00 PM, 1:30 PM - 5:30 PM",
            tuesday: "10:00 AM - 1:00 PM, 1:30 PM - 5:30 PM",
            wednesday: "10:00 AM - 1:00 PM, 1:30 PM - 5:30 PM",
            thursday: "10:00 AM - 1:00 PM, 1:30 PM - 5:30 PM",
            friday: "10:00 AM - 1:00 PM, 1:30 PM - 5:30 PM",
            saturday: "10:00 AM - 1:00 PM, 1:30 PM - 5:30 PM",
            sunday: "10:00 AM - 1:00 PM, 1:30 PM - 5:30 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Triveni Sangam",
        location: { type: "Point", coordinates: [81.8812322188929, 25.422810485813788] },
        type: "tourist_spot",
        time: {
            monday: "6:00 AM - 10:00 PM",
            tuesday: "6:00 AM - 10:00 PM",
            wednesday: "6:00 AM - 10:00 PM",
            thursday: "6:00 AM - 10:00 PM",
            friday: "6:00 AM - 10:00 PM",
            saturday: "6:00 AM - 10:00 PM",
            sunday: "6:00 AM - 10:00 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Allahabad Fort",
        location: { type: "Point", coordinates: [81.8768830112897, 25.429727664659197] },
        type: "tourist_spot",
        time: {
            monday: "9:44 AM - 6:00 PM",
            tuesday: "9:44 AM - 6:00 PM",
            wednesday: "9:44 AM - 6:00 PM",
            thursday: "9:44 AM - 6:00 PM",
            friday: "9:44 AM - 6:00 PM",
            saturday: "9:44 AM - 6:00 PM",
            sunday: "9:44 AM - 6:00 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Khusro Bagh",
        location: { type: "Point", coordinates: [81.82108171129019, 25.442406914212803] },
        type: "tourist_spot",
        time: {
            monday: "6:00 AM - 7:00 PM",
            tuesday: "6:00 AM - 7:00 PM",
            wednesday: "6:00 AM - 7:00 PM",
            thursday: "6:00 AM - 7:00 PM",
            friday: "6:00 AM - 7:00 PM",
            saturday: "6:00 AM - 7:00 PM",
            sunday: "6:00 AM - 7:00 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Swaraj Bhawan",
        location: { type: "Point", coordinates: [81.86033519569467, 25.45997204010627] },
        type: "tourist_spot",
        time: {
            monday: "9:30 AM - 4:30 PM",
            tuesday: "9:30 AM - 4:30 PM",
            wednesday: "9:30 AM - 4:30 PM",
            thursday: "9:30 AM - 4:30 PM",
            friday: "9:30 AM - 4:30 PM",
            saturday: "9:30 AM - 4:30 PM",
            sunday: "9:30 AM - 4:30 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "All Saints Cathedral",
        location: { type: "Point", coordinates: [81.8265956805997, 25.45138395456534] },
        type: "tourist_spot",
        time: {
            monday: "9:00 AM - 5:00 PM",
            tuesday: "9:00 AM - 5:00 PM",
            wednesday: "9:00 AM - 5:00 PM",
            thursday: "9:00 AM - 5:00 PM",
            friday: "9:00 AM - 5:00 PM",
            saturday: "9:00 AM - 5:00 PM",
            sunday: "9:00 AM - 5:00 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Chandrashekhar Azad Park",
        location: { type: "Point", coordinates: [81.85180950657832, 25.457489423939737] },
        type: "tourist_spot",
        time: {
            monday: "5:00 AM - 9:00 PM",
            tuesday: "5:00 AM - 9:00 PM",
            wednesday: "5:00 AM - 9:00 PM",
            thursday: "5:00 AM - 9:00 PM",
            friday: "5:00 AM - 9:00 PM",
            saturday: "5:00 AM - 9:00 PM",
            sunday: "5:00 AM - 9:00 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Minto Park",
        location: { type: "Point", coordinates: [81.86173507898228, 25.43273844997473] },
        type: "tourist_spot",
        time: {
            monday: "5:00 AM - 8:00 AM, 5:30 PM - 7:00 PM",
            tuesday: "5:00 AM - 8:00 AM, 5:30 PM - 7:00 PM",
            wednesday: "5:00 AM - 8:00 AM, 5:30 PM - 7:00 PM",
            thursday: "5:00 AM - 8:00 AM, 5:30 PM - 7:00 PM",
            friday: "5:00 AM - 8:00 AM, 5:30 PM - 7:00 PM",
            saturday: "5:00 AM - 8:00 AM, 5:30 PM - 7:00 PM",
            sunday: "5:00 AM - 8:00 AM, 5:30 PM - 7:00 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Shri Bade Hanuman Ji Mandir",
        location: { type: "Point", coordinates: [81.87898703352825, 25.435293473212933] },
        type: "tourist_spot",
        time: {
            monday: "5:00 AM - 2:00 PM, 5:00 PM - 10:30 PM",
            tuesday: "5:00 AM - 2:00 PM, 5:00 PM - 10:30 PM",
            wednesday: "5:00 AM - 2:00 PM, 5:00 PM - 10:30 PM",
            thursday: "5:00 AM - 2:00 PM, 5:00 PM - 10:30 PM",
            friday: "5:00 AM - 2:00 PM, 5:00 PM - 10:30 PM",
            saturday: "5:00 AM - 2:00 PM, 5:00 PM - 10:30 PM",
            sunday: "5:00 AM - 2:00 PM, 5:00 PM - 10:30 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Saraswati Ghat",
        location: { type: "Point", coordinates: [81.86876000943538, 25.43101406258951] },
        type: "tourist_spot",
        time: {
            monday: "5:00 AM - 5:00 PM",
            tuesday: "5:00 AM - 5:00 PM",
            wednesday: "5:00 AM - 5:00 PM",
            thursday: "5:00 AM - 5:00 PM",
            friday: "5:00 AM - 5:00 PM",
            saturday: "5:00 AM - 5:00 PM",
            sunday: "5:00 AM - 5:00 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Sri Akshayavat Temple Patalpuri",
        location: { type: "Point", coordinates: [81.87764348245341, 25.430553688422787] },
        type: "tourist_spot",
        time: {
            monday: "6:00 AM - 6:30 PM",
            tuesday: "6:00 AM - 6:30 PM",
            wednesday: "6:00 AM - 6:30 PM",
            thursday: "6:00 AM - 6:30 PM",
            friday: "6:00 AM - 6:30 PM",
            saturday: "6:00 AM - 6:30 PM",
            sunday: "6:00 AM - 6:30 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Jawahar Planetarium",
        location: { type: "Point", coordinates: [81.86031399779984, 25.459001434502177] },
        type: "tourist_spot",
        time: {
            monday: "11:00 AM - 5:30 PM",
            tuesday: "11:00 AM - 5:30 PM",
            wednesday: "11:00 AM - 5:30 PM",
            thursday: "11:00 AM - 5:30 PM",
            friday: "11:00 AM - 5:30 PM",
            saturday: "11:00 AM - 5:30 PM",
            sunday: "11:00 AM - 5:30 PM"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "New Yamuna Bridge Prayagraj",
        location: { type: "Point", coordinates: [81.86154384198048, 25.42644432181743] },
        type: "tourist_spot",
        time: {
            monday: "Open 24 hours",
            tuesday: "Open 24 hours",
            wednesday: "Open 24 hours",
            thursday: "Open 24 hours",
            friday: "Open 24 hours",
            saturday: "Open 24 hours",
            sunday: "Open 24 hours"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    },
    {
        name: "Old Naini Bridge",
        location: { type: "Point", coordinates: [81.85000900758062, 25.424861559826713] },
        type: "tourist_spot",
        time: {
            monday: "Open 24 hours",
            tuesday: "Open 24 hours",
            wednesday: "Open 24 hours",
            thursday: "Open 24 hours",
            friday: "Open 24 hours",
            saturday: "Open 24 hours",
            sunday: "Open 24 hours"
        },
        image: "IMAGE_URL_HERE",
        description: "DESCRIPTION_HERE"
    }
];
const stops = [...touristSpots];
module.exports = { stops };
