const express=require('express');
const fs=require('fs');
const path=require('path');
const bodyParser=require('body-parser');

var DATA=require('./data/DATA.json');

var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

	app.get('/read',(req,res)=>{
		
		var con={};
		
		fs.stat(__dirname+"/data/sample.txt",(err,stats)=>{
			var fileSize = stats["size"];
			con.size=fileSize;
		});
		
		con.fileType=path.extname('sample.txt');
		
		fs.readFile(__dirname+'/data/sample.txt',(err,data)=>{
			if(err)
				throw err;
			con.content=data.toString();
			
			//con.content=fs.readFileSync('sample.txt').toString();
			var len=con.content.length;
			con.vowels=0,con.consonants=0,con.specialCharacters=0;
			var str=con.content;
						
			for(i=0;i<len;i++){
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
			
			res.send(con);
			
		});
	});
		
		
	app.get('/math',(req,res)=>{
		var a=req.query.a;
		var b=req.query.b;
		
		console.log(req.query);
		result=Math.pow(a,b);
		res.send({result});
	});

	
	app.get('/data',(req,res)=>{
				
		res
			.status(200)
			.json(DATA);
	});
	
	app.post('/data',(req,res)=>{
		
		var dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		var obj=JSON.parse(dataString);
		
		var len=obj.length;
		var max=0;
						
		for(i=0;i<len;i++){
			if(obj[i].id>max)
				max=obj[i].id;
		}
		
		obj.push({
			id:max+1,
			name:req.body.name,
			age:parseInt(req.body.age,10),
			gender:req.body.gender,
			salary:parseInt(req.body.salary,10),
			dob:new Date(req.body.dob).toISOString().slice(0, 10),
			deleted:JSON.parse(req.body.deleted)
		});
		fs.writeFileSync(__dirname+"/data/DATA.json",JSON.stringify(obj));
		
		console.log(obj);
		res.json(obj);
	});
	
	
	app.get('/sort',(req,res)=>{
		var dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		var obj=JSON.parse(dataString);
		
		
		obj.sort((a,b)=>(a.age>b.age)? 1:((b.age > a.age)? -1:0))
		
		fs.writeFileSync(__dirname+"/data/DATA.json",JSON.stringify(obj));
		
		console.log(obj);
		res.json(obj);
	});
	
	app.get('/avg-salary',(req,res)=>{
		var dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		var obj=JSON.parse(dataString);
		
		var len=obj.length;
		var sum=0,avg=0;
						
		for(i=0;i<len;i++){
			sum=sum+obj[i].salary;
		}
		avg=sum/len;
				
		console.log(avg);
		res.json(avg);
	});
	
	app.get('/data/:id',(req,res)=>{
		var dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		var obj=JSON.parse(dataString);
		
		var len=obj.length;
		var result;
			
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
		.json(result);
	});
	
	
	app.patch('/data/:id',(req,res)=>{
		var dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		var obj=JSON.parse(dataString);
		
		var len=obj.length;
		var result;
			
		for(i=0;i<len;i++){
			if(obj[i].id==req.params.id){
				obj[i].name=req.body.name,
				obj[i].age=req.body.age,
				obj[i].gender=req.body.gender,
				obj[i].salary=req.body.salary,
				obj[i].dob=req.body.dob,
				obj[i].deleted=req.body.deleted
				result=obj[i];
			}
				
		}
		fs.writeFileSync(__dirname+"/data/DATA.json",JSON.stringify(obj));
		
		if(!result){
			res
				.status(404)
				.send("ID not found in the file");
		}
		
		res
		.status(200)
		.json(result);
	});
	
app.listen(4040,()=>{
	console.log('started on port 4040');
});
