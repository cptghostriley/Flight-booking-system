"use strict";(()=>{var e={};e.id=777,e.ids=[777],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1212:e=>{e.exports=require("async_hooks")},4770:e=>{e.exports=require("crypto")},6162:e=>{e.exports=require("stream")},1764:e=>{e.exports=require("util")},3757:e=>{e.exports=import("prettier/plugins/html")},5747:e=>{e.exports=import("prettier/standalone")},4492:e=>{e.exports=require("node:stream")},1676:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>l,requestAsyncStorage:()=>d,routeModule:()=>p,serverHooks:()=>g,staticGenerationAsyncStorage:()=>c});var a=r(9303),i=r(8716),n=r(670),s=r(2341),u=e([s]);s=(u.then?(await u)():u)[0];let p=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/bookings/create/route",pathname:"/api/bookings/create",filename:"route",bundlePath:"app/api/bookings/create/route"},resolvedPagePath:"D:\\Projects\\SkyBooker\\app\\api\\bookings\\create\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:c,serverHooks:g}=p,m="/api/bookings/create/route";function l(){return(0,n.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:c})}o()}catch(e){o(e)}})},2341:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{POST:()=>p});var a=r(7070),i=r(9487),n=r(7044),s=r(8084),u=r(2723),l=e([s,n]);[s,n]=l.then?(await l)():l;let c=new u.R(process.env.RESEND_API_KEY);async function p(e){try{let t=await e.json(),{flights:r,passengers:o,payment:u,totalAmount:l,userId:p}=t;if(!p)return a.NextResponse.json({error:"User ID is required for booking"},{status:400});let g=`SB${Date.now().toString().slice(-6)}`,[m]=await (0,i.i)`
      INSERT INTO bookings (
        user_id,
        flight_id, -- Assuming outbound flight ID for simplicity, adjust if multiple flights per booking
        passenger_name,
        passenger_email,
        total_price,
        booking_status
      ) VALUES (
        ${p},
        ${r.outbound?.id||null}, -- Link to outbound flight ID
        ${o[0]?.firstName+" "+o[0]?.lastName||"N/A"},
        ${o[0]?.email||"N/A"},
        ${l},
        'confirmed'
      )
      RETURNING id, booking_status, created_at
    `,h={bookingReference:g,flights:r,passengers:o,totalAmount:l,status:"confirmed",bookingDate:m.created_at.toISOString()};if(process.env.RESEND_API_KEY){let e="",t=`
        <p>Dear ${o[0]?.firstName??"Valued"} ${o[0]?.lastName??"Customer"},</p>
        <p>Your flight booking has been confirmed! Your booking reference is <strong>${g}</strong>.</p>
        <p>Please check the plain text version of this email for full details, or log in to your SkyBooker account.</p>
        <p>Thank you for choosing SkyBooker!</p>
      `;try{let r=(0,n.render)((0,s.S)({bookingData:h})),o="string"==typeof r?r:String(r||"");o&&o.trim().length>0?e=o:(console.warn("React email render returned empty or invalid HTML. Using fallback."),e=t)}catch(r){console.error("Error rendering email HTML:",r),e=t}let{data:r,error:a}=await c.emails.send({from:"SkyBooker <onboarding@resend.dev>",to:[o[0]?.email||""],subject:`Flight Booking Confirmed - ${g}`,html:e,text:d(h)});a?console.error("Resend error:",a):console.log("✅ Email sent successfully:",r)}else{console.log("RESEND_API_KEY not found, simulating email send...");let e=d(h);console.log("\uD83D\uDCE7 Email would be sent to:",o[0]?.email),console.log("\uD83D\uDCE7 Email content:",e)}return a.NextResponse.json({success:!0,bookingReference:g,booking:{...m,flights:t.flights,passengers:t.passengers,totalAmount:t.totalAmount}})}catch(e){return console.error("Booking creation error:",e),a.NextResponse.json({error:"Failed to create booking"},{status:500})}}function d(e){let{bookingReference:t,flights:r,passengers:o,totalAmount:a}=e;return`
Dear ${o[0]?.firstName??"Valued"} ${o[0]?.lastName??"Customer"},

🎉 Your flight booking has been confirmed!

BOOKING DETAILS
===============
Booking Reference: ${t??"N/A"}
Total Amount: $${a??"0.00"}
Booking Date: ${new Date(e.bookingDate).toLocaleDateString()}

FLIGHT INFORMATION
==================
${r?.outbound?`
✈️ OUTBOUND FLIGHT
Flight: ${r.outbound.airline??"N/A"} ${r.outbound.flightNumber??"N/A"}
From: ${r.outbound.departure?.airport??"N/A"} at ${r.outbound.departure?.time??"N/A"}
To: ${r.outbound.arrival?.airport??"N/A"} at ${r.outbound.arrival?.time??"N/A"}
Date: ${r.outbound.departure?.date??"N/A"}
Duration: ${r.outbound.duration??"N/A"}
Aircraft: ${r.outbound.aircraft??"N/A"}
${0===r.outbound.stops?"Direct Flight":`${r.outbound.stops??0} Stop(s)`}
`:""}

${r?.return?`
✈️ RETURN FLIGHT
Flight: ${r.return.airline??"N/A"} ${r.return.flightNumber??"N/A"}
From: ${r.return.departure?.airport??"N/A"} at ${r.return.departure?.time??"N/A"}
To: ${r.return.arrival?.airport??"N/A"} at ${r.return.arrival?.time??"N/A"}
Date: ${r.return.departure?.date??"N/A"}
Duration: ${r.return.duration??"N/A"}
Aircraft: ${r.return.aircraft??"N/A"}
${0===r.return.stops?"Direct Flight":`${r.return.stops??0} Stop(s)`}
`:""}

PASSENGER INFORMATION
====================
${o.map((e,t)=>`
${t+1}. ${e.firstName??"N/A"} ${e.lastName??"N/A"}
   Email: ${e.email??"N/A"}
   Phone: ${e.phone??"N/A"}
   Date of Birth: ${e.dateOfBirth??"N/A"}
`).join("")}

IMPORTANT REMINDERS
==================
• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights
• Bring a valid government-issued photo ID for domestic flights or passport for international flights
• Check-in online 24 hours before your flight to save time at the airport
• Keep this booking reference handy: ${t??"N/A"}

Need help? Contact our support team at support@skybooker.com

Thank you for choosing SkyBooker!

Best regards,
The SkyBooker Team

---
This is an automated message. Please do not reply to this email.
  `.trim()}o()}catch(e){o(e)}})},9487:(e,t,r)=>{r.d(t,{i:()=>o});let o=(0,r(2237).qn)(process.env.DATABASE_URL)}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,972,237,267,84],()=>r(1676));module.exports=o})();