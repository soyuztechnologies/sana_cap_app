//Import reusable entity which has types
using { anubhav.commons } from './commons';
using { cuid, temporal, managed } from '@sap/cds/common';


//uniquely identify project
namespace sana.team1;

//context - just for grouping of entities
context master {
      
    //.INCLUDE
    entity student: commons.address{
        key id : commons.Guid;
        name: String(100);
        gender: String(2);
        rollNo: Integer;
        //foreign key -- it will auto connect to PK of Dept(check table)
        //@ Runtime the table column name will be columnName_PKColumnName
        //class_id
        class: Association to one Departments ;
    }

    entity Departments {
        key id: commons.Guid;
        deptName: String(120);
        specialization: String(120);
        hod: String(100);
    };

    entity books {
        key id: commons.Guid;
        bookName: localized String(100);
        author: String(100);
        stock: Int16;
    }

}

context transaction {
    
    entity Subs: cuid, managed, temporal {
        book : Association to one master.books;
        student: Association to one master.student;
    };


}
