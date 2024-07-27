'use strict';

//employee class for shared information
class Employee{
    constructor(name, age){
        this.name=name;
        this.age=age;
        this.id=idGenerator.getNextId();
    }

    get annualSalary(){
        return this.calculateAnnualSalary();
    }

    calculateAnnualSalary(){
        throw new Error('calculateAnnualSalary() must be implemented by subclass.');
    }
}

class EmployeeIdGenerator{
    constructor(){
        this.currentId=1;
    }

    getNextId(){
        return this.currentId++;
    }

    resetIds(){
        this.currentId=1;
    }
}

const idGenerator=new EmployeeIdGenerator();

const weeksPerYear=52;

//extend to partime specifics
class PartTime extends Employee{
    constructor(name, age, payRate, hoursPerWeek){
        super(name, age);
        this.payRate=payRate;
        this.hoursPerWeek=hoursPerWeek;
        this.employeeType='Part-Time';
    }

    //formula for part time salary
    calculateAnnualSalary(){
        return this.payRate * this.hoursPerWeek *weeksPerYear;
    }
}

//extend to manager specifics
class Manager extends Employee{
    constructor(name, age, payRate, hoursPerWeek){
        super(name, age);
        this.payRate=payRate;
        this.hoursPerWeek=hoursPerWeek;
        this.employeeType='Manager';
    }
    //formula for manager salary
    calculateAnnualSalary(){
        return (this.hoursPerWeek * this.payRate *weeksPerYear) - 1000;
    }
}


//main class
class Main{
    constructor(){
        this.employees=[];
        this.initialize();
    }

    //create preloaded employees
    initialize(){
        let managerEmployee=new Manager('Marc', 43, 23, 42);
        let partTimeEmployee1=new PartTime('Matt', 31, 15, 22);
        let partTimeEmployee2=new PartTime('Ella', 35, 14, 16);

        this.employees.push(managerEmployee);
        this.employees.push(partTimeEmployee1);
        this.employees.push(partTimeEmployee2);

        this.displayEmployees();
        this.newMenu();
    }

    //menu with options
    newMenu(){
        const choice=prompt("Choose an option:\n1. Add Employee\n2. Remove Employee\n3. Edit Employee\n4. Display Employees");

        if (choice==='1'){
            this.addEmployeePrompt();
        }
        else if (choice==='2'){
            this.removeEmployeePrompt();
        }
        else if (choice==='3'){
            this.editEmployeePrompt();
        }
        else if (choice==='4'){
            this.displayEmployees();
        }
    }

    //add employee function
    addEmployeePrompt(){
        const input=prompt("Add a new employee. Please enter employee name, age, pay rate, and hours worked per week separated by commas.");

        if (input){
            const [name, age, payRate, hoursPerWeek]=input.split(',').map(item=>item.trim());

            if (!name || isNaN(age) || isNaN(payRate) || isNaN(hoursPerWeek)){
                alert('One or more values were entered incorrectly. Please make sure only letters are used in the name and only numbers for all other values.');
                return;
            }

            const ageNumber=parseFloat(age);
            const payRateNumber=parseFloat(payRate);
            const hoursPerWeekNumber=parseFloat(hoursPerWeek);

            console.clear();

            if (hoursPerWeekNumber>=40){
                const managerEmployee=new Manager(name, ageNumber, hoursPerWeekNumber, payRateNumber);
                this.employees.push(managerEmployee);
            }
            else{
                const partTimeEmployee= new PartTime(name, ageNumber, hoursPerWeekNumber, payRateNumber);
                this.employees.push(partTimeEmployee);
            }

            this.displayEmployees();
        }
        else{
            alert('No information provided!');
        }
        this.newMenu();
    }

    //remove employee function
    removeEmployeePrompt(){
        const input=prompt("Enter the name or ID number of the employee you wish to remove.");

        if (input){
            const trimmedInput=input.trim();
            const idNumber=!isNaN(trimmedInput);
            let removed=false;
            
            //remove by id
            if (idNumber){
                const employeeId=parseFloat(trimmedInput);

                const employeeExists=this.employees.some(employee=>employee.id===employeeId);
                if (!employeeExists){
                    alert(`No employee found with ID ${employeeId}.`);
                    this.newMenu();
                    return;
                }

                const originalLength=this.employees.length;
                this.employees=this.employees.filter(employee=>employee.id !==employeeId);
                removed=this.employees.length<originalLength;
            }

            //remove by name
            else{
                const employeeName=trimmedInput.toLowerCase();
                console.log(`Attempting to remove employee '${employeeName}`);
                console.log("Current employees data before removal:", this. employees);

                const employeeExists=this.employees.some(employee=> typeof employee.name==='string' && employee.name.toLowerCase()===employeeName);
                if (!employeeExists){
                    alert(`No employee found with name '${employeeName}'.`);
                    this.newMenu();
                    return;
                }

                const originalLength=this.employees.length;
                this.employees=this.employees.filter(employee=>typeof employee.name === 'string' && employee.name.toLowerCase() !== employeeName);
                removed=this.employees.length<originalLength;

                if (removed){
                    console.log(`Employee with name '${employeeName}' has been removed`);
                }
                else{
                    console.log(`Employee with '${employeeName}' not found after filtering.`);
                }
            }

            if (removed){
                //update ID's 
                idGenerator.resetIds();
                this.employees.forEach(employee=>employee.id=idGenerator.getNextId());
                console.clear();
                this.displayEmployees();
            }
            else{
                alert('There is no employee with the name or ID you entered.');
                this.newMenu();
            }
        }

        else{
            alert('You have not selected an option. Please try again.');
            this.newMenu();
        }
    }


    //edit employee function
    editEmployeePrompt(){
        const input=prompt("Enter the employee ID of the employee you wish to edit.");

        if (input){
            const employeeId=parseFloat(input);
            const employee=this.employees.find(emp=>emp.id===employeeId);

            if (employee){
                const newPayRate=parseFloat(prompt(`Enter the new pay rate for ${employee.name}.\n(Current pay rate: ${employee.payRate})`));

                if (!isNaN(newPayRate) && newPayRate>0){
                    employee.payRate=newPayRate;
                    console.clear();
                    this.displayEmployees();
                }
                else{
                    alert('Invalid pay rate entered. It must be a positive number.');
                }
            }
            else{
                alert('The ID you entered does not match our files.');
            }

            this.newMenu();
        }

        else{
            alert('Nothing has been entered. Please try again.');
            this.newMenu();
        }
    }

    displayEmployees(){
        //display in console log appearing like a table
        console.clear();
        console.log("ID\tName\t\tAge\t\tSalary\t\tHours\t\tPay\t\tType");

        this.employees.forEach(employee =>{
            const salary=employee.annualSalary;
            const hours=employee.hoursPerWeek;
            const pay=employee.payRate;

            console.log(`${employee.id}\t${employee.name}\t\t${employee.age}\t\t${salary}\t\t${hours}\t\t\t${pay}\t\t${employee.employeeType}`);
        });

        this.newMenu();
    }
}

(function(){
    new Main();
})();