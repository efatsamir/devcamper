import bcrypt from 'bcryptjs';

export default [
	{
		_id: "5d7a514b5d2c12c7449be042",
		first_name: "Admin",
		last_name: "Account",
		email: "admin@gmail.com",
		role: "user",
		password: bcrypt.hashSync("Dev@123456", 10)
	
	},
	{
		_id: "5d7a514b5d2c12c7449be043",
		first_name: "Publisher",
		last_name: "Account",
		email: "publisher@gmail.com",
		role: "publisher",
		password: bcrypt.hashSync("Dev@123456", 10)
	
	},
	{
		_id: "5d7a514b5d2c12c7449be044",
		first_name: "User",
		last_name: "Account",
		email: "user@gmail.com",
		role: "user",
		password: bcrypt.hashSync("Dev@123456", 10)
	
	},
	{
		_id: "5d7a514b5d2c12c7449be045",
		first_name: "John",
		last_name: "Doe",
		email: "john@gmail.com",
		role: "publisher",
		password: bcrypt.hashSync("Dev@123456", 10)
	
	},
	{
		_id: "5d7a514b5d2c12c7449be046",
		first_name: "Kevin",
		last_name: "Smith",
		email: "kevin@gmail.com",
		role: "publisher",
		password: bcrypt.hashSync("Dev@123456", 10)
		
	},
	{
		_id: "5c8a1d5b0190b214360dc031",
		first_name: "Mary",
		last_name: "Williams",
		email: "mary@gmail.com",
		role: "publisher",
		password: bcrypt.hashSync("Dev@123456", 10)
	
	},
	{
		_id: "5c8a1d5b0190b214360dc032",
		first_name: "Sasha",
		last_name: "Ryan",
		email: "sasha@gmail.com",
		role: "publisher",
		password: bcrypt.hashSync("Dev@123456", 10)
		
	},
	{
		_id: "5c8a1d5b0190b214360dc033",
		first_name: "Greg",
		last_name: "Harris",
		email: "greg@gmail.com",
		role: "user",
		password: bcrypt.hashSync("Dev@123456", 10)
	
	},
	{
		_id: "5c8a1d5b0190b214360dc034",
		first_name: "Derek",
		last_name: "Glover",
		email: "derek@gmail.com",
		role: "user",
		password: bcrypt.hashSync("Dev@123456", 10)
	
	},
	{
		_id: "5c8a1d5b0190b214360dc035",
		first_name: "Stephanie",
		last_name: "Hanson",
		email: "steph@gmail.com",
		role: "user",
		password: bcrypt.hashSync("Dev@123456", 10)
		
	},
	{
		_id: "5c8a1d5b0190b214360dc036",
		first_name: "Jerry",
		last_name: "Wiliams",
		email: "jerry@gmail.com",
		role: "user",
		password: bcrypt.hashSync("Dev@123456", 10)
		
	},
	{
		_id: "5c8a1d5b0190b214360dc037",
		first_name: "Maggie",
		last_name: "Johnson",
		email: "maggie@gmail.com",
		role: "user",
		password: bcrypt.hashSync("Dev@123456", 10)
	
	},
	{
		_id: "5c8a1d5b0190b214360dc038",
		first_name: "Barry",
		last_: "Dickens",
		email: "barry@gmail.com",
		role: "user",
		password: "Dev@123456"
	
	},
	{
		_id: "5c8a1d5b0190b214360dc039",
		first_name: "Ryan",
		last_name: "Bolin",
		email: "ryan@gmail.com",
		role: "user",
		password: "Dev@123456"
	
	},
	{
		_id: "5c8a1d5b0190b214360dc040",
		first_name: "Sara",
		last_name: "Kensing",
		email: "sara@gmail.com",
		role: "user",
		password: "Dev@123456"
	
	}
]
