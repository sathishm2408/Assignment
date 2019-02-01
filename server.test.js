const expect=require('expect');
const request=require('supertest');
const fs=require('fs');

const {app}=require('./server');

	describe('GET/read',()=>{
		it('should read the contents of a file',(done)=>{
		
			var content=fs.readFileSync(__dirname+'/data/sample.txt').toString();		
			//var size;
			
			request(app)
			.get('/read')
			.expect(200)
			.expect((res)=>{
				expect(res.body.content).toBe(content);
				//expect(res.body).toBeTruthy(size)
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}
			
				done();
			});
		
		});
	});
	
	
	describe('GET/math',()=>{
		it('should return the value of a^b',(done)=>{
		//var ob={a:2,b:3};
			request(app)
			.get('/math?a=2&b=3')
			.expect(200)
			//.send(ob)
			.expect((res)=>{
				expect(res.body.result).toBe(8);
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}
			
				done();
			});
		
		});
	});
	
	
	describe('Create api to read data from DATA.json',()=>{
	describe('GET/data',()=>{
		it('should read all the records in the DATA.json file',()=>{
		
			var content=fs.readFileSync(__dirname+'/data/DATA.json');		
			var obj=JSON.parse(content);
			var len=obj.length;
						
			request(app)
			.get('/data')
			.expect(200)
			.expect((res)=>{
				var obj1=JSON.parse(res.body);
				var len1=obj1.length;
				expect(obj1).toEqual(obj);
				expect(len1).toBe(len);
			})
			.end((err,res)=>{
				if(err){
					return err;
				}
			
				//done();
			});
		
		});
	});
	
	
	
	/**describe('POST/data',()=>{
		it('should post data in the DATA.json file',(done)=>{
		
			var content=fs.readFileSync(__dirname+'/data/DATA.json');		
			var obj=JSON.parse(content);
			var len=obj.length;
			
			var newobj={name:"karthi",age:27,gender:"male",salary:15000,dob:1990-05-11,deleted:false};
			
			request(app)
			.post('/data')
			.send(newobj)
			.expect(200)
			.expect((res)=>{
				var obj1=JSON.parse(res.body);
				var len1=obj1.length;
				expect(len1).toBe(len+1);
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}
			
				done();
			});
		
		});
	});
	**/
	
	
	
	describe('GET/sort',()=>{
		it('should sort all the records in the DATA.json file',()=>{
		
		var dataString=fs.readFileSync(__dirname+"/data/DATA.json");
		var obj=JSON.parse(dataString);
				
		obj.sort((a,b)=>(a.age>b.age)? 1:((b.age > a.age)? -1:0))
		
						
			request(app)
			.get('/data')
			.expect(200)
			.expect((res)=>{
				expect(res.body).toEqual(obj);
			})
			.end((err,res)=>{
				if(err){
					return err;
				}
			
			});
		});
	});
	
	
	describe('GET/avg-salary',()=>{
		it('should calculate the average salary of all the records in the DATA.json file',()=>{
		
			var content=fs.readFileSync(__dirname+'/data/DATA.json');		
			var obj=JSON.parse(content);
			var len=obj.length;
			var sum=0,avg=0;
						
			for(i=0;i<len;i++){
				sum=sum+obj[i].salary;
			}
			avg=sum/len;
						
			request(app)
			.get('/avg-salary')
			.expect(200)
			.expect((res)=>{
				expect(res.body).toBe(avg);
			})
			.end((err,res)=>{
				if(err){
					return err;
				}
			
				//done();
			});
		
		});
	});
	
	
	describe('GET/data/:id',()=>{
		it('should get a records in the DATA.json file',()=>{
		
			request(app)
			.get('/data/3')
			.expect(200)
			.expect((res)=>{
				expect(res.body.id).toBe(3);
			})
			.end((err,res)=>{
				if(err){
					return err;
				}
			
				//done();
			});
		
		});
	});
	
	/**
	describe('PATCH/data/:id',()=>{
		it('should post data in the DATA.json file',(done)=>{
		
			var newobj={name:"karthi",age:27,gender:"male",salary:15000,dob:1990-05-11,deleted:false};
			
			request(app)
			.post('/data/:id')
			.send(newobj)
			.expect(200)
			.expect((res)=>{
				var obj1=JSON.parse(res.body);
				expect(obj1).toEqual(newobj);
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}
			
				done();
			});
		
		});
	});
	
	**/
	});