# project_db
Download XAMPP and select version 8.0.0 PHP 8.0.0 at https://www.apachefriends.org/download.html

Run the downloaded .exe file and select next for every option. The installation will begin and takes ~2 minutes.

Once complete, the XAMPP control panel will open. Click the 'Start' button for Apache and MySQL.
Click on 'config' button for Apache.
Click on Apache(httpd. conf) file. Change port 80 to 8080 in the file (three times). Save and close the file.
Restart Xampp.
Now apache will run in port 8080.

Go to C:\xampp\htdocs and paste the folders from GitHub: charts, forms, tables
e.g. htdocs\charts

Open up localhost:8080/phpmyadmin in Chrome and go to 'databases'->'create database'->name it 'project_db' then hit 'create'->'import'->'choose file'->select project_db.sql->'go' at the bottom. You'll see within database project_db there are now three tables: part_directory, weight_detroit, weight_traverse_city

There is no need to create a user or password as it will use 'root' as user and no password required.
Go to the table dashboard at localhost:8080/tables/plant_weight_table.html to view the table.
