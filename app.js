const express=require('express');
const mysql=require('mysql');
const app=express();

app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'bd_proyecto_oficial'
});

db.connect((err)=>{
    if(err){throw err;}
    console.log('BD Conectada');
});

// ==================== CRUD PROYECTOS ====================
app.get('/',(req,res)=>{
    let sql="SELECT p.id, p.nombre, p.descripcion, c.nombre AS cliente, e.nombre AS estado FROM Proyectos p JOIN Clientes c ON p.cliente_id=c.id JOIN EstadosProyecto e ON p.estado_id=e.id";
    db.query(sql,(err,results)=>{
        if(err){throw err;}
        res.render('proyectos/index',{proyectos:results});
    });
});

app.get('/proyectos/crear',(req,res)=>{
    let sqlClientes="SELECT * FROM Clientes";
    let sqlEstados="SELECT * FROM EstadosProyecto";
    db.query(sqlClientes,(err,clientes)=>{
        if(err){throw err;}
        db.query(sqlEstados,(err2,estados)=>{
            if(err2){throw err2;}
            res.render('proyectos/crear',{clientes:clientes,estados:estados});
        });
    });
});

app.post('/proyectos/crear',(req,res)=>{
    let nom=req.body.nombre;
    let desc=req.body.descripcion;
    let cli=req.body.cliente_id;
    let est=req.body.estado_id;
    let sql="INSERT INTO Proyectos (nombre,descripcion,cliente_id,estado_id) VALUES (?,?,?,?)";
    db.query(sql,[nom,desc,cli,est],(err,result)=>{
        if(err){throw err;}
        res.redirect('/');
    });
});

app.get('/proyectos/editar/:id',(req,res)=>{
    let id=req.params.id;
    let sqlProy="SELECT * FROM Proyectos WHERE id="+db.escape(id);
    let sqlClientes="SELECT * FROM Clientes";
    let sqlEstados="SELECT * FROM EstadosProyecto";
    db.query(sqlProy,(err,proy)=>{
        if(err){throw err;}
        db.query(sqlClientes,(err2,clientes)=>{
            if(err2){throw err2;}
            db.query(sqlEstados,(err3,estados)=>{
                if(err3){throw err3;}
                res.render('proyectos/editar',{proyecto:proy[0],clientes:clientes,estados:estados});
            });
        });
    });
});

app.post('/proyectos/editar/:id',(req,res)=>{
    let id=req.params.id;
    let nom=req.body.nombre;
    let desc=req.body.descripcion;
    let cli=req.body.cliente_id;
    let est=req.body.estado_id;
    let sql="UPDATE Proyectos SET nombre=?, descripcion=?, cliente_id=?, estado_id=? WHERE id=?";
    db.query(sql,[nom,desc,cli,est,id],(err,result)=>{
        if(err){throw err;}
        res.redirect('/');
    });
});

app.get('/proyectos/eliminar/:id',(req,res)=>{
    let id=req.params.id;
    let sql="DELETE FROM Proyectos WHERE id="+db.escape(id);
    db.query(sql,(err,result)=>{
        if(err){throw err;}
        res.redirect('/');
    });
});

// ==================== CRUD CLIENTES ====================
app.get('/clientes',(req,res)=>{
    let sql="SELECT * FROM Clientes";
    db.query(sql,(err,results)=>{
        if(err){throw err;}
        res.render('clientes/index',{clientes:results});
    });
});

app.get('/clientes/crear',(req,res)=>{
    res.render('clientes/crear');
});

app.post('/clientes/crear',(req,res)=>{
    let nom=req.body.nombre;
    let cont=req.body.contacto;
    let sql="INSERT INTO Clientes (nombre,contacto) VALUES (?,?)";
    db.query(sql,[nom,cont],(err,result)=>{
        if(err){throw err;}
        res.redirect('/clientes');
    });
});

app.get('/clientes/editar/:id',(req,res)=>{
    let id=req.params.id;
    let sql="SELECT * FROM Clientes WHERE id="+db.escape(id);
    db.query(sql,(err,result)=>{
        if(err){throw err;}
        res.render('clientes/editar',{cliente:result[0]});
    });
});

app.post('/clientes/editar/:id',(req,res)=>{
    let id=req.params.id;
    let nom=req.body.nombre;
    let cont=req.body.contacto;
    let sql="UPDATE Clientes SET nombre=?, contacto=? WHERE id=?";
    db.query(sql,[nom,cont,id],(err,result)=>{
        if(err){throw err;}
        res.redirect('/clientes');
    });
});

app.get('/clientes/eliminar/:id',(req,res)=>{
    let id=req.params.id;
    let sql="DELETE FROM Clientes WHERE id="+db.escape(id);
    db.query(sql,(err,result)=>{
        if(err){throw err;}
        res.redirect('/clientes');
    });
});

// ==================== CRUD TAREAS ====================
app.get('/tareas',(req,res)=>{
    let sql="SELECT t.id, t.nombre, t.asignado_a, t.fecha_entrega, p.nombre AS proyecto, e.nombre AS estado FROM Tareas t JOIN Proyectos p ON t.proyecto_id=p.id JOIN EstadosProyecto e ON t.estado_id=e.id";
    db.query(sql,(err,results)=>{
        if(err){throw err;}
        res.render('tareas/index',{tareas:results});
    });
});

app.get('/tareas/crear',(req,res)=>{
    let sqlProy="SELECT * FROM Proyectos";
    let sqlEstados="SELECT * FROM EstadosProyecto";
    db.query(sqlProy,(err,proyectos)=>{
        if(err){throw err;}
        db.query(sqlEstados,(err2,estados)=>{
            if(err2){throw err2;}
            res.render('tareas/crear',{proyectos:proyectos,estados:estados});
        });
    });
});

app.post('/tareas/crear',(req,res)=>{
    let proy=req.body.proyecto_id;
    let nom=req.body.nombre;
    let asig=req.body.asignado_a;
    let fec=req.body.fecha_entrega;
    let est=req.body.estado_id;
    let sql="INSERT INTO Tareas (proyecto_id,nombre,asignado_a,fecha_entrega,estado_id) VALUES (?,?,?,?,?)";
    db.query(sql,[proy,nom,asig,fec,est],(err,result)=>{
        if(err){throw err;}
        res.redirect('/tareas');
    });
});

app.get('/tareas/editar/:id',(req,res)=>{
    let id=req.params.id;
    let sqlTarea="SELECT * FROM Tareas WHERE id="+db.escape(id);
    let sqlProy="SELECT * FROM Proyectos";
    let sqlEstados="SELECT * FROM EstadosProyecto";
    db.query(sqlTarea,(err,tarea)=>{
        if(err){throw err;}
        db.query(sqlProy,(err2,proyectos)=>{
            if(err2){throw err2;}
            db.query(sqlEstados,(err3,estados)=>{
                if(err3){throw err3;}
                res.render('tareas/editar',{tarea:tarea[0],proyectos:proyectos,estados:estados});
            });
        });
    });
});

app.post('/tareas/editar/:id',(req,res)=>{
    let id=req.params.id;
    let proy=req.body.proyecto_id;
    let nom=req.body.nombre;
    let asig=req.body.asignado_a;
    let fec=req.body.fecha_entrega;
    let est=req.body.estado_id;
    let sql="UPDATE Tareas SET proyecto_id=?, nombre=?, asignado_a=?, fecha_entrega=?, estado_id=? WHERE id=?";
    db.query(sql,[proy,nom,asig,fec,est,id],(err,result)=>{
        if(err){throw err;}
        res.redirect('/tareas');
    });
});

app.get('/tareas/eliminar/:id',(req,res)=>{
    let id=req.params.id;
    let sql="DELETE FROM Tareas WHERE id="+db.escape(id);
    db.query(sql,(err,result)=>{
        if(err){throw err;}
        res.redirect('/tareas');
    });
});

// ==================== CONSULTAS ====================
app.get('/consulta1',(req,res)=>{
    let sql="SELECT c.nombre AS cliente, COUNT(p.id) AS total_proyectos FROM Clientes c LEFT JOIN Proyectos p ON c.id=p.cliente_id GROUP BY c.id";
    db.query(sql,(err,results)=>{
        if(err){throw err;}
        res.render('consulta1',{resultados:results});
    });
});

app.get('/consulta2',(req,res)=>{
    let sql="SELECT p.nombre AS proyecto, t.nombre AS tarea, t.asignado_a, t.fecha_entrega, e.nombre AS estado_tarea FROM Tareas t JOIN Proyectos p ON t.proyecto_id=p.id JOIN EstadosProyecto e ON t.estado_id=e.id";
    db.query(sql,(err,results)=>{
        if(err){throw err;}
        res.render('consulta2',{resultados:results});
    });
});

app.listen(3000,()=>{
    console.log('Servidor Node corriendo en puerto 3000');
});