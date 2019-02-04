const express=require('express');
const fs=require('fs');
const path=require('path');
const bodyParser=require('body-parser');

let DATA=require('./data/DATA.json');

let app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

	//api to read the contents of the file(sample.txt)
	app.get('/read',(req,res)=>{
		let con={};
		
		//to get the size of the file using fs module
		fs.stat(__dirname+"/data/sample.txt",(err,stats)=>{
			if(err)
				throw err;
			let fileSize = stats["size"];
			con.size=fileSize;
		});
		
		//to find the type of file using path module
		con.fileType=path.extname('sample.txt');
		
		//read the content of the file asynchronously
		fs.readFile(__dirname+'/data/sample.txt',(err,data)=>{
			if(err)
				throw err;
			con.content=data.toString();
			
			//con.content=fs.readFileSync('sample.txt').toString();
			let len=con.content.length;
			con.vowels=0,con.consonants=0,con.specialCharacters=0;
			let str=con.content;
			getCount(str);
			//to find the no of vowels,consonants and special chracters			
			function getCount(words) {
				var words=(typeof words == 'string') ? words : '';
				count=re=>(words.match(re)||[]).length;
				con.vowels=count(/[aeiou]/ig);
				con.consonants=count(/[bcdfghjklmnpqrstvxzwy]/ig);
				con.specialCharacters=count(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);
				}
			
			/**for(i=0;i<len;i++){
				if(str[i]=='a' || str[i]=='e' || str[i]=='i' ||str[i]=='o' || str[i]=='u' || str[i]=='A' ||str[i]=='E' || str[i]=='I' || str[i]=='O' ||str[i]=='U')
				{
					con.vowels++;
				}
				else if((str[i]>='a'&& str[i]<='z') || (str[i]>='A'&& str[i]<='Z'))
				{
					con.consonants++;
				}
				else if(str[i]>='0' && str[i]<='9'){}
				else if(str[i]==' '){}	
				else
				{
					con.specialCharacters++;
				}
			}
			**/
			res.send(con);
			
		});
	});
		
		
	//api to return the result of a^b	
	app.get('/math',(req,res)=>{
		let a=req.query.a;
		let b=req.query.b;
		
		//console.log(req.query);
		result=Math.pow(a,b);
		res.send({result});
	});

	
	//api to get all the records in the DATA.json file
	app.get('/data',(req,res)=>{
				
		res
			.status(200)
			.send(DATA);
	});
	
	
	//api to add data to DATA.json file(ID should be autogenerated and incremental based on the existing data)
	app.post('/data',(req,res)=>{
		
		let dataString;
		//reading the file synchronously
		try{
		dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		}catch(err){
			if (err.code === 'ENOENT') {
				console.log('File not found!');
			} else {
				throw err;
			}
		}
		let obj=JSON.parse(dataString);
		
		let len=obj.length;
		let max=0;
		
		//to get last value of ID	
		for(i=0;i<len;i++){
			if(obj[i].id>max)
				max=obj[i].id;
		}
		
		//pushing the request body data to the array
		obj.push({
			id:max+1,
			name:req.body.name,
			age:parseInt(req.body.age,10),
			gender:req.body.gender,
			salary:parseInt(req.body.salary,10),
			dob:new Date(req.body.dob).toISOString().slice(0, 10),
			deleted:JSON.parse(req.body.deleted)
		});
		
		//writing the file synchronously
		try{
		fs.writeFileSync(__dirname+"/data/DATA.json",JSON.stringify(obj));
		}catch(err){
			if (err.code === 'ENOENT') {
				console.log('File not found!');
			} else {
				throw err;
			}
		}
		//console.log(obj);
		res.send(obj);
	});
	

	//api to sort the data in the DATA.json file on the basis of age in ascending order
	app.get('/sort',(req,res)=>{
		let dataString;
		
		//reading the file synchronously
		try{
			dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		}catch(err){
			if (err.code === 'ENOENT') {
				console.log('File not found!');
			} else {
				throw err;
			}
		}
		let obj=JSON.parse(dataString);
		
		
		//sorting the array
		obj.sort((a,b)=>(a.age>b.age)? 1:((b.age > a.age)? -1:0))
		
		try{
		fs.writeFileSync(__dirname+"/data/DATA.json",JSON.stringify(obj));
		}catch(err){
			if (err.code === 'ENOENT') {
				console.log('File not found!');
			} else {
				throw err;
			}
		}
		
		
		//console.log(obj);
		res.send(obj);
	});

	
	//api which tells the average salary of records
	app.get('/avg-salary',(req,res)=>{
		
		let dataString;
		
		//reading the file synchronously
		try{
			dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		}catch(err){
			if (err.code === 'ENOENT') {
				console.log('File not found!');
			} else {
				throw err;
			}
		}
		
		let obj=JSON.parse(dataString);
		
		let len=obj.length;
		let sum=0,avg=0;
		
		//calculating the sum of the salary of all records
		for(i=0;i<len;i++){
			sum=sum+obj[i].salary;
		}
		avg=sum/len;
				
		console.log(avg);
		res.send({avg});
	});

	
	//api to find a record based on ID	
	app.get('/data/:id',(req,res)=>{
		
		let dataString;
		
		//reading the file synchronously
		try{
			dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		}catch(err){
			if (err.code === 'ENOENT') {
				console.log('File not found!');
			} else {
				throw err;
			}
		}
		
		let obj=JSON.parse(dataString);
		
		let len=obj.length;
		let result;
		
		//to get the object based on the request ID
		for(i=0;i<len;i++){
			if(obj[i].id==req.params.id)
				result=obj[i];
		}
		if(!result){
			res
				.status(404)
				.send("ID not found in the file");
		}
		
		res
		.status(200)
		.send(result);
	});
	
	
	//api to modify a record based on ID
	app.patch('/data/:id',(req,res)=>{
		
		let dataString;
		
		//reading the file synchronously
		try{
			dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		}catch(err){
			if (err.code === 'ENOENT') {
				console.log('File not found!');
			} else {
				throw err;
			}
		}
		
		let obj=JSON.parse(dataString);
		
		let len=obj.length;
		let result;
		
		//assigning the request body data to the particular record based on ID 
		for(i=0;i<len;i++){
			if(obj[i].id==req.params.id){
				obj[i].name=req.body.name,
				obj[i].age=parseInt(req.body.age,10),
				obj[i].gender=req.body.gender,
				obj[i].salary=parseInt(req.body.salary,10),
				obj[i].dob=req.body.dob,
				obj[i].deleted=JSON.parse(req.body.deleted)
				result=obj[i];
			}
				
		}
		
		
		if(!result){
			res
				.status(404)
				.send("ID not found in the file");
		}
		
		try{
		fs.writeFileSync(__dirname+"/data/DATA.json",JSON.stringify(obj));
		}catch(err){
			if (err.code === 'ENOENT') {
				console.log('File not found!');
			} else {
				throw err;
			}
		}
		
		res
		.status(200)
		.send(result);
		
	});
	
app.listen(4040,()=>{
	console.log('started on port 4040');
});


module.exports={app};
