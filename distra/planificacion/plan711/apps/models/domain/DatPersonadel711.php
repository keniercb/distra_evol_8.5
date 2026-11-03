<?php

class DatPersonadel711 extends BaseDatPersonadel711 {
    
    public function setUp() {
        parent::setUp();
    }
    
    public function listarPersonas711($params){
        $conn = Doctrine_Manager::connection();
        $addWhere = "true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'nombreapellidos') {
                    $addWhere .= " AND ((upper(nombre) LIKE " . "'%" . strtoupper($datos['data']['value']). "%')OR"
                            . "(upper(apellidos) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'))";
                }elseif ($datos ['field'] == 'iddatostp') {
                    $addWhere .= " AND upper(p.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                    
                }elseif ($datos ['field'] == 'activo') {
                    if ($datos['data']['value'] == true) {
                        $addWhere .= " AND activo = 1";
                    }if ($datos['data']['value'] == FALSE) {
                        $addWhere .= " AND activo = 0";
                    }
                }elseif ($datos ['field'] == 'nombrepertenece') {
                    $addWhere .= " AND upper(nombrepertenece) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                      
                }
            }
        } 
        if ($params['idestructura']!=null) {
            $addWhere .= " AND ((identidad = {$params['idestructura']}) or (iddatosempimp is not null))";
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
                
        $sql = "SELECT idpersonadel711, 
                        nombre||' '||apellidos as nombreapellidos,
                        nombre, 
                        apellidos, 
                        idtipopersona, 
                        p.denominacion as iddatostp, 
                        identidad, 
                        iddatosempimp, 
                        p1.denominacion as importadora,
                        iddatoscategoria, 
                        p2.denominacion as categoria, 
                        correoelec, 
                        telefono, 
                        idunidadcompra as iddatosuc, 
                        p3.denominacion as datosuc, 
                        activo, 
                        nombrepertenece,
                        count (*) over() as total 
                FROM mod_plan711.dat_personadel711 prod
                     left JOIN mod_planificacion.nom_datosnomenclador p ON (prod.idtipopersona = p.iddatosnomenclador)
                     left JOIN mod_planificacion.nom_datosnomenclador p1 ON (prod.iddatosempimp = p1.iddatosnomenclador)
                     left JOIN mod_planificacion.nom_datosnomenclador p2 ON (prod.iddatoscategoria = p2.iddatosnomenclador)
                     left JOIN mod_planificacion.nom_datosnomenclador p3 ON (prod.idunidadcompra = p3.iddatosnomenclador) where $addWhere and prod.ocultar = 1
                group by idpersonadel711, nombre, apellidos, idtipopersona, p.denominacion, identidad, iddatosempimp, p1.denominacion, iddatoscategoria, p2.denominacion , correoelec, telefono, idunidadcompra , p3.denominacion , activo, nombrepertenece "
                . "$delimitando";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    
    
    public function AdicionarPersona($paramestros){
        
        $conn = Doctrine_Manager::connection();
        
            $sqlupd = "INSERT INTO mod_plan711.dat_personadel711(
                            nombre, 
                            apellidos, 
                            idtipopersona,";
                  $sqlupd .=($paramestros['idempdest'] != null) ? " identidad,": null."";  
                  $sqlupd .=($paramestros['idempimp'] != null) ? " iddatosempimp,": null."";
                  $sqlupd .=($paramestros['cp'] != null) ? " iddatoscategoria,": null."";
                  $sqlupd .=($paramestros['correo'] != null) ? " correoelec,": null."";
                  $sqlupd .=($paramestros['telf'] != null) ? " telefono,": null."";
                  $sqlupd .=($paramestros['uc'] != null) ? " idunidadcompra,": null."";
                  $sqlupd .=($paramestros['empvalue'] != null) ? " nombrepertenece": null."";
                            ;
                                        
                   $sqlupd .= ") VALUES ('{$paramestros['nombre']}', 
                            '{$paramestros['apell']}', 
                            {$paramestros['tp']},"; 
                  $sqlupd .=($paramestros['idempdest'] != null) ? " {$paramestros['idempdest']},": null."";
                  $sqlupd .=($paramestros['idempimp'] != null) ? " {$paramestros['idempimp']},": null."";
                  $sqlupd .=($paramestros['cp'] != null) ? " {$paramestros['cp']},": null."";
                  $sqlupd .=($paramestros['correo'] != null) ? " '{$paramestros['correo']}',": null."";
                  $sqlupd .=($paramestros['telf'] != null) ? " '{$paramestros['telf']}',": null."";
                  $sqlupd .=($paramestros['uc'] != null) ? " {$paramestros['uc']},": null."";
                  $sqlupd .=($paramestros['empvalue'] != null) ? " '{$paramestros['empvalue']}'": null."";
                   $sqlupd .=");";          
         //var_dump($sqlupd); die;
            $conn->execute($sqlupd); 
        return 1;
    }
    
    public function ModificarPersona($paramestros){
        
        $conn = Doctrine_Manager::connection();
            $sqlupd = "UPDATE mod_plan711.dat_personadel711
                        SET"; 
                  $sqlupd .=($paramestros['nombre'] != null) ? " nombre='{$paramestros['nombre']}',": null."";
                  $sqlupd .=($paramestros['apell'] != null) ? " apellidos='{$paramestros['apell']}',": null."";
                  $sqlupd .=($paramestros['tp'] != null) ? " idtipopersona='{$paramestros['tp']}',": null."";
                  $sqlupd .=($paramestros['idempdest'] != null) ? " identidad ={$paramestros['idempdest']},": null."";
                  $sqlupd .=($paramestros['idempimp'] != null) ? " iddatosempimp ={$paramestros['idempimp']},": null."";
                  $sqlupd .=($paramestros['cp'] != null) ? " iddatoscategoria ={$paramestros['cp']},": null."";
                  $sqlupd .=($paramestros['correo'] != null) ? " correoelec ='{$paramestros['correo']}',": null."";
                  $sqlupd .=($paramestros['telf'] != null) ? " telefono ='{$paramestros['telf']}',": null."";
                  $sqlupd .=($paramestros['uc'] != null) ? " idunidadcompra ={$paramestros['uc']},": null."";
                  $sqlupd .=($paramestros['empvalue'] != null) ? " nombrepertenece ='{$paramestros['empvalue']}'": null."";
                  
                  $sqlupd .=" WHERE idpersonadel711={$paramestros['idpersonadel711']};";
                  //var_dump($sqlupd);die;
            $conn->execute($sqlupd);     
        return 1;
    }
    
    public function EliminarPersona($paramestros){
        $conn = Doctrine_Manager::connection();
            $sqlupd = "UPDATE mod_plan711.dat_personadel711
                        SET  
                        ocultar=0, activo=0                        
                      WHERE idpersonadel711={$paramestros['idpersonadel711']};";
            $conn->execute($sqlupd);     
        return 1;
    }
    
    public function InhabilitarPersona($paramestros){
        $conn = Doctrine_Manager::connection();
            $sqlupd = "UPDATE mod_plan711.dat_personadel711
                        SET  
                        activo=0                        
                      WHERE idpersonadel711={$paramestros['idpersonadel711']};";
            $conn->execute($sqlupd);     
        return 1;
    }
    public function HabilitarPersona($paramestros){
        $conn = Doctrine_Manager::connection();
            $sqlupd = "UPDATE mod_plan711.dat_personadel711
                        SET  
                        activo=1                        
                      WHERE idpersonadel711={$paramestros['idpersonadel711']};";
            $conn->execute($sqlupd);     
        return 1;
    }
    
}
