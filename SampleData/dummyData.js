const insertDummyData = (db, transactions_db) => {
    for(var i = 0; i<=9; i+=1)
    {
        db.query(`insert into DepartmentData (departmentAbbr, departmentName) values ('DEP${i}', 'DEPARTMENT${i}')`);
    }
}

module.exports = insertDummyData;