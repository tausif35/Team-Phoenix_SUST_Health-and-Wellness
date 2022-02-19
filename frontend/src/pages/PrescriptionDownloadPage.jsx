// import axios from 'axios'
// import React from 'react'
// import { useSelector } from 'react-redux';
// import PDFDocument from 'pdf-lib';
// import fs from 'fs'

// const PrescriptionDownloadPage = () => {

//   const { userInfo } = useSelector((state) => state.userLogin);
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${userInfo.token}`,
//     },
//   };

//   let res;
//   const pres = async () => {
//     try {
//       res = await axios.get(`http://localhost:5000/api/appointments/prescription/6210af6b2481c063067642aa`,
//         config);


//       let prescriptionFile = fs.readFileSync("../../public/form.pdf")
//       console.log(prescriptionFile)
//       const pdfDoc = PDFDocument.load(prescriptionFile)
//       console.log(pdfDoc)

//       const form = pdfDoc.getForm()

//       // Get all fields in the PDF by their names
//       const professionalField = form.getTextField('doctorName')
//       const dateField = form.getTextField('date')
//       const patientField = form.getTextField('patientName')
//       const ageField = form.getTextField('patientAge')
//       const diagnosisField = form.getTextField('diagnosis')
//       const testsField = form.getTextField('tests')
//       const adviceField = form.getTextField('advice')

//       // Fill in the basic info fields
//       professionalField.setText("nihal")
//       dateField.setText('24/11/2021')
//       ageField.setText('24 years')
//       patientField.setText('Nihal')
//       diagnosisField.setText(res.data.diagnosis)
//       testsField.setText(res.data.tests)
//       adviceField.setText(res.data.advice)

//       form.flatten();
//       // Serialize the PDFDocument to bytes (a Uint8Array)
//       const pdfBytes = pdfDoc.save()
//       //Write the PDF to a file
//       fs.writeFileSync('../../public/test.pdf', pdfDoc.save());

//     } catch (error) {
//       console.log(error);
//     }
//   }


//   // function generatePrescription() {
//   //   let prescriptionFile = fs.readFileSync("../../public/form.pdf")
//   //   console.log(prescriptionFile)
//   //   const pdfDoc = await PDFDocument.load(prescriptionFile)
//   //   console.log(pdfDoc)

//   //   const form = pdfDoc.getForm()

//   //   // Get all fields in the PDF by their names
//   //   const professionalField = form.getTextField('doctorName')
//   //   const dateField = form.getTextField('date')
//   //   const patientField = form.getTextField('patientName')
//   //   const ageField = form.getTextField('patientAge')
//   //   const diagnosisField = form.getTextField('diagnosis')
//   //   const testsField = form.getTextField('tests')
//   //   const adviceField = form.getTextField('advice')

//   //   // Fill in the basic info fields
//   //   professionalField.setText()
//   //   dateField.setText('24/11/2021')
//   //   ageField.setText('24 years')
//   //   patientField.setText('Nihal')
//   //   diagnosisField.setText('ded')
//   //   testsField.setText('none')
//   //   adviceField.setText('Paracetamol 2 bela')

//   //   form.flatten();
//   //   // Serialize the PDFDocument to bytes (a Uint8Array)
//   //   const pdfBytes = pdfDoc.save()
//   //   //Write the PDF to a file
//   //   fs.writeFileSync('../../public/test.pdf', await pdfDoc.save());
//   // }

//   return (
//     <div>
//       <button onClick={pres}>Download Image</button>
//     </div>
//   )
// }

// export default PrescriptionDownloadPage