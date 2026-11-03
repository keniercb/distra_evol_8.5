<?php

class DatUserNotificar extends BaseDatUserNotificar {
    
    public function setUp() {
        parent::setUp();
    }
        
    public function listarUserNotificar($parametros) {
        $conn = Doctrine_Manager::connection();
        $addWhere = "true";
        
        if($parametros['idrol']){
            $addWhere .= " and idrol = {$parametros['idrol']}";
        }  
        if($parametros['listaidrol']){
//            $lista=implode(',', $parametros['listaidrol']);
            $addWhere .= " and idrol in ({$parametros['listaidrol']} )";
        }        
        if($parametros['identidad']){
            $addWhere .= " and (identidad = {$parametros['identidad']} or identidad is null)";
        }
        if($parametros['contacto']){
            $addWhere .= " and (dat_contacto.contacto is not null)";
        }
        
        if ($parametros['filtros']) {
                foreach ($parametros['filtros'] as $datos) {
                    if ($datos['field'] == 'nombreusuario') {
                        $addWhere .= " AND upper(nombreusuario) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                    }elseif ($datos ['field'] == 'entidad') {
                        $addWhere .= " AND upper(entidad) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                    }elseif ($datos ['field'] == 'rol') {
                        $addWhere .= " AND upper(rol) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                    }elseif ($datos ['field'] == 'contacto') {
                        $addWhere .= " AND upper(contacto) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                    }        
                }
            }
            
            $sql = "SELECT idusernotificar, nombreusuario, idusuario,idrol, rol, identidad, entidad, 
                        identidad, dat_usernotificar.idpersona, 
                    dat_contacto.idcontacto, 
                    dat_contacto.contacto
                    FROM mod_plan711.dat_usernotificar
                    left join mod_persona.dat_contacto on (dat_usernotificar.idpersona = dat_contacto.idpersona) 
                    WHERE 
                        $addWhere"
                    . " order by entidad desc";
            
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function AdcionarUserNotificar($parametros) {
        $obj = new DatUserNotificar();
        $obj->nombreusuario = $parametros['nombreusuario'];
        $obj->idusuario = $parametros['idusuario'];
        $obj->rol = $parametros['rol'];
        $obj->idrol = $parametros['idrol'];
        $obj->entidad = $parametros['entidad'];
        $obj->identidad = $parametros['identidad'];
        $obj->idpersona = $parametros['idpersona'];
        $obj->save();
        return 1;
    }
    
    public function LimpiarLista($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE FROM mod_plan711.dat_usernotificar";
        $conn->execute($sql);
        return 1;
    }
    
    /**
     * De aqui para abajo se realizaran unos metodos de consulta a tablas del marco de trabjo,
     * porque no existe un servicio que pueda ayudar a resolver la necesidades de gestion.
     * 
     */
    
    /**
     * Obtener el id acceso a entidad de un usuario a una entidad x
     * @param type $parametros array que contiene el idusuario y el idrol
     * @return identidad  acceso
     */
    public function ObtenerIdAcceso($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT identidad
                            FROM mod_seguridad.dat_entidadusuariorol where idusuario = {$parametros['idusuario']}"
                . "and idrol = {$parametros['idrol']}";
                
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    /**
     * Obtener el idfila de la entidad a la que tiene acceso un usuario
     * @param type idacceso
     * @return idfila
     */
    public function ObtenerIdfila($idacceso) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT nom_filaestruc.idfila, dat_estructura.denominacion
                    FROM mod_estructuracomp.nom_filaestruc, 
                         mod_estructuracomp.dat_estructura 
                         where idfila = idestructura and accesofila[$idacceso] = 1 :: bit;";
                
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }    
    /**
     * Obtener los datos generales de la persona mas los datos de contacto
     * @param type idpersona
     * @return persona
     */
    public function getCorreos($idpersona) {
        $ids= implode(',', $idpersona);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    dat_persona.idpersona, 
                    dat_persona.nombre, 
                    dat_persona.snombre, 
                    dat_persona.papel, 
                    dat_persona.sapel, 
                    dat_contacto.idcontacto, 
                    dat_contacto.contacto
                  FROM 
                    mod_persona.dat_persona 
                    inner join mod_persona.dat_contacto on (dat_persona.idpersona = dat_contacto.idpersona) 
                  WHERE 
                   dat_persona.idpersona in ($ids)";
                
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    } 
    
    public function CrearPersona($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql1 = "Select nextval('mod_persona.sec_persona_seq'::regclass);";
                
        $arrayResult = $conn->execute($sql1)->fetchAll(PDO::FETCH_ASSOC);

        $parametros->idpersona=$arrayResult[0]['nextval'];
        $sql = "INSERT INTO 
          mod_persona.dat_persona
        (
          idpersona,
          nombre,
          papel,
          sapel,
          sexo
        )
        VALUES (
          {$parametros->idpersona},
          '{$parametros->nombreusuario}', 
          '{$parametros->nombreusuario}', 
          '{$parametros->nombreusuario}',
          1
        );";
        $conn->execute($sql);
//        Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        $sql = "UPDATE 
          mod_seguridad.seg_usuario 
        SET 
          idpersona = {$parametros->idpersona}
          WHERE 
          idusuario = {$parametros->idusuario};";
        $conn->execute($sql);
        
        $sql = "UPDATE mod_plan711.dat_usernotificar
                    SET idpersona={$parametros->idpersona}
                  WHERE idusernotificar={$parametros->idusernotificar}";
        $conn->execute($sql);
//        ;
//   Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        return $parametros->idpersona;
    }
    public function CrearDatoContacto($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_persona.dat_contacto(
                        contacto, oficial, idtipomediocontacto, idtipocontacto, idpersona)
                VALUES ( '{$parametros->contacto}', 1, 2, 5, {$parametros->idpersona})";
        $conn->execute($sql);
//        Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        
        return 1;
    }
    public function EliminarDatoContacto($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE FROM mod_persona.dat_contacto
                    WHERE idpersona = {$parametros->idpersona};";
        $conn->execute($sql);
//        Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        
        return 1;
    }
    /**
     *         INSERT INTO 
          mod_persona.dat_persona
        (
          idpersona,
          nombre,
          papel,
          sapel,
          sexo
        )
        VALUES (
          v_idpersona,
          r_personas.nombreusuario, --nombre,
          r_personas.nombreusuario, --papel,
          r_personas.nombreusuario, --sapel,
          1 --sexo,
        );

        UPDATE 
          mod_seguridad.seg_usuario 
        SET 
          idpersona = v_idpersona
          WHERE 
          idusuario = r_personas.idusuario;
     */
}
