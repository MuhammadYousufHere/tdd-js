import XLSX from 'xlsx'

const filePath = 'data/users.xlsx'
const sheet = 'Sheet1'
const requiredColumn = 'A'
const maximumRowNumber = 1000000

export default class Excel {
   async importData() {
      /* Promise all take array of independent commands */
      await Promise.all([this.importUsers()]).then(() => {
         console.log('Uploaded finished!................... ^_^')
      })
   }

   async importUsers() {
      const xlsx = XLSX.readFile(filePath)
      const range = xlsx.Sheets[sheet]!

      console.log('Users data uploaded...')

      for (let row = 2; row <= maximumRowNumber; ++row) {
         if (!range[`${requiredColumn}${row}`]) {
            break // stop if no another  data
         }

         const rowIns = {
            excelId: range[`A${row}`].w,
            nameAr: range[`B${row}`] ? range[`B${row}`].w : '',
            name: range[`C${row}`] ? range[`C${row}`].w : '',
            birthDate: new Date(range[`D${row}`].w),
            gender: range[`E${row}`] ? range[`E${row}`].w : '',
            isActive: true,
         }

         this.addUser(rowIns)
         // this.updateUser(rowIns);
      }
      console.log('Users Done!')
   }
   addUser(data: any) {
      console.log(data)
   }
}
export const excelIns = new Excel()
