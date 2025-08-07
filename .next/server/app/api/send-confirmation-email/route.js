"use strict";(()=>{var e={};e.id=746,e.ids=[746],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1212:e=>{e.exports=require("async_hooks")},4770:e=>{e.exports=require("crypto")},6162:e=>{e.exports=require("stream")},1764:e=>{e.exports=require("util")},3757:e=>{e.exports=import("prettier/plugins/html")},5747:e=>{e.exports=import("prettier/standalone")},4492:e=>{e.exports=require("node:stream")},9361:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{originalPathname:()=>g,patchFetch:()=>l,requestAsyncStorage:()=>d,routeModule:()=>p,serverHooks:()=>c,staticGenerationAsyncStorage:()=>m});var n=r(9303),a=r(8716),i=r(670),s=r(8068),u=e([s]);s=(u.then?(await u)():u)[0];let p=new n.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/send-confirmation-email/route",pathname:"/api/send-confirmation-email",filename:"route",bundlePath:"app/api/send-confirmation-email/route"},resolvedPagePath:"D:\\Projects\\SkyBooker\\app\\api\\send-confirmation-email\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:m,serverHooks:c}=p,g="/api/send-confirmation-email/route";function l(){return(0,i.patchFetch)({serverHooks:c,staticGenerationAsyncStorage:m})}o()}catch(e){o(e)}})},8068:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{POST:()=>l});var n=r(7070),a=r(2723),i=r(7044),s=r(8084),u=e([s,i]);[s,i]=u.then?(await u)():u;let d=new a.R(process.env.RESEND_API_KEY);async function l(e){try{let{email:t,bookingData:r}=await e.json();if(!process.env.RESEND_API_KEY){console.log("RESEND_API_KEY not found, simulating email send...");let e=p(r);return console.log("\uD83D\uDCE7 Email would be sent to:",t),console.log("\uD83D\uDCE7 Email content:",e),n.NextResponse.json({success:!0,message:"Email simulated (no API key configured)",emailSent:!1,simulatedContent:e})}let o="",a=`
      <p>Dear ${r.passengers[0].firstName} ${r.passengers[0].lastName},</p>
      <p>Your flight booking has been confirmed! Your booking reference is <strong>${r.bookingReference}</strong>.</p>
      <p>Please check the plain text version of this email for full details, or log in to your SkyBooker account.</p>
      <p>Thank you for choosing SkyBooker!</p>
    `;try{let e=(0,i.render)((0,s.S)({bookingData:r})),t="string"==typeof e?e:String(e||"");t&&t.trim().length>0?o=t:(console.warn("React email render returned empty or invalid HTML. Using fallback."),o=a)}catch(e){console.error("Error rendering email HTML:",e),o=a}let{data:u,error:l}=await d.emails.send({from:"SkyBooker <onboarding@resend.dev>",to:[t],subject:`Flight Booking Confirmed - ${r.bookingReference}`,html:o,text:p(r)});if(l)return console.error("Resend error:",l),n.NextResponse.json({error:"Failed to send email",details:l},{status:500});return console.log("✅ Email sent successfully:",u),n.NextResponse.json({success:!0,message:"Confirmation email sent successfully",emailSent:!0,emailId:u?.id})}catch(e){return console.error("Email sending error:",e),n.NextResponse.json({error:"Failed to send confirmation email"},{status:500})}}function p(e){let{bookingReference:t,flights:r,passengers:o,totalAmount:n}=e;return`
Dear ${o[0].firstName} ${o[0].lastName},

🎉 Your flight booking has been confirmed!

BOOKING DETAILS
===============
Booking Reference: ${t}
Total Amount: $${n}
Booking Date: ${new Date(e.bookingDate).toLocaleDateString()}

FLIGHT INFORMATION
==================
${r.outbound?`
✈️ OUTBOUND FLIGHT
Flight: ${r.outbound.airline} ${r.outbound.flightNumber}
From: ${r.outbound.departure.airport} at ${r.outbound.departure.time}
To: ${r.outbound.arrival.airport} at ${r.outbound.arrival.time}
Date: ${r.outbound.departure.date}
Duration: ${r.outbound.duration}
Aircraft: ${r.outbound.aircraft}
${0===r.outbound.stops?"Direct Flight":`${r.outbound.stops} Stop(s)`}
`:""}

${r.return?`
✈️ RETURN FLIGHT
Flight: ${r.return.airline} ${r.return.flightNumber}
From: ${r.return.departure.airport} at ${r.return.departure.time}
To: ${r.return.arrival.airport} at ${r.return.arrival.time}
Date: ${r.return.departure.date}
Duration: ${r.return.duration}
Aircraft: ${r.return.aircraft}
${0===r.return.stops?"Direct Flight":`${r.return.stops} Stop(s)`}
`:""}

PASSENGER INFORMATION
====================
${o.map((e,t)=>`
${t+1}. ${e.firstName} ${e.lastName}
   Email: ${e.email}
   Phone: ${e.phone}
   Date of Birth: ${e.dateOfBirth}
`).join("")}

IMPORTANT REMINDERS
==================
• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights
• Bring a valid government-issued photo ID for domestic flights or passport for international flights
• Check-in online 24 hours before your flight to save time at the airport
• Keep this booking reference handy: ${t}

Need help? Contact our support team at support@skybooker.com

Thank you for choosing SkyBooker!

Best regards,
The SkyBooker Team

---
This is an automated message. Please do not reply to this email.
  `.trim()}o()}catch(e){o(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,972,267,84],()=>r(9361));module.exports=o})();