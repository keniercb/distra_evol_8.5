<?php

class PersonaAPKService extends ZendExt_Model
{
    
	/*Metodo que devuelve las funcionalidades que el usuario tiene acceso y los parametros iniciales para el trabajo con la apk*/
	public function damefuncionalidadesapk($usuario, $pass)
    {
        $passs = md5($pass);
        $respuesta = array();
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT su.idusuario, su.nombreusuario
            FROM mod_seguridad.seg_usuario su
        WHERE su.nombreusuario = '$usuario' AND su.contrasenna = '$passs' AND su.activo = true;";
        $r = $conn->fetchAll($sql);
        if($r[0]['nombreusuario'] == $usuario){
            $respuesta['autenticado'] = 1;
            $sql = "SELECT DISTINCT sfapk.id, su.idusuario
            FROM mod_seguridad.seg_usuario su
            INNER JOIN mod_seguridad.dat_entidadusuariorol deur ON (deur.idusuario = su.idusuario) 
            INNER JOIN mod_seguridad.dat_sistemarolfuncionalidadaccion dsrfa ON (dsrfa.idrol = deur.idrol)
            INNER JOIN mod_rrhhmaestro.seg_funcionalidadesapk sfapk ON (sfapk.idrecurso = dsrfa.idrecurso)
        WHERE su.nombreusuario = ? ;";
            $r = $conn->fetchAll($sql, array($usuario));
            $a = array();
            foreach($r as $i){
                $a[] = $i['id'];
            }
            $respuesta['funcionalidades'] = $a;

            if(!empty($r)){
                $respuesta['idusuario'] = $r[0]['idusuario'];
            }else{
                $respuesta['idusuario'] = -1;
            }

            $sql = "SELECT DISTINCT nfe.idfila, su.iddominio,nfe.ordenunico
          FROM mod_seguridad.seg_usuario su
          INNER JOIN mod_seguridad.dat_entidadusuariorol deur ON (deur.idusuario = su.idusuario) 
          INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (nfe.accesofila[deur.identidad] = '1')
          WHERE su.nombreusuario = ? order by nfe.ordenunico;";
            $r = $conn->fetchAll($sql, array($usuario));
            if(!empty($r)){
                $respuesta['idestructura'] = $r[0]['idfila'];
                $respuesta['iddominio'] = $r[0]['iddominio'];
            }
        } else {
            $respuesta['autenticado'] = 0;
        }
		return json_encode($respuesta);
    }
	
	/*Funcion para buscar una estructura o los hijos de ese estructura dado su dominio*/
	public function buscarestructura($idestructura, $iddominio, $buscarhijos)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
		
		$sql = "SELECT nfe.idfila as id, nfe.idconcepto,
				(CASE WHEN de.idestructura IS NOT NULL THEN de.denominacion
					  WHEN deop.idestructuraop IS NOT NULL THEN deop.denominacion
					  WHEN dc.idcargo IS NOT NULL THEN nc.denominacion
					  ELSE 'NO CONOCIDO' END
				) as text,
				CASE
				  WHEN (
					SELECT COUNT(idfila)
					FROM mod_estructuracomp.nom_filaestruc
					WHERE idpadre = nfe.idfila AND idpadre <> idfila
					) = 0
				  then 1 else 0
				END AS leaf,
				i.icono as icon
			  FROM mod_estructuracomp.nom_filaestruc nfe
			  LEFT JOIN mod_estructuracomp.dat_estructura de ON (de.idestructura = nfe.idfila AND de.idproyecto = 0) 
			  LEFT JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = nfe.idfila AND deop.idproyecto = 0)
			  LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = nfe.idfila AND dc.idproyecto = 0)
			  LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
			  LEFT JOIN mod_estructuracomp.nom_concepto c ON (c.idconcepto = nfe.idconcepto)
			  LEFT JOIN mod_estructuracomp.nom_icono i ON (i.idicono = c.idicono)
			  ";
		
		if($buscarhijos){
			$sql .= " WHERE nfe.idpadre = ? AND nfe.dominiofila[{$iddominio}] = '1' order by nfe.ordenunico;";
		}else{
			$sql .= " WHERE nfe.idfila = ? AND nfe.dominiofila[{$iddominio}] = '1' order by nfe.ordenunico;";
		}

		$r = $conn->fetchAll($sql, array($idestructura));
		
		return json_encode($r);
			
    }

    public function getDatosBasicosPersonas($numid, $nombre, $snombre, $papel, $sapel, $idestructura, $idusuario, $iddominio, $limit, $start)
    {
        $objpersona = new DatPersonaModel();
        $r = $objpersona->getDatosBasicosPersonas($numid, $nombre, $snombre, $papel, $sapel, $idestructura, $idusuario, $iddominio, $limit, $start);
        return json_encode($r);

    }

    public function getDatosFichaPersona($idpersona)
    {
        $objpersona = new DatPersonaModel();
        $r = $objpersona->getDatosFichaPersona($idpersona);
        return json_encode($r);

    }

    public function getGraficasApk($idusuario, $iddominio, $idestructura, $fecha)
    {
        $r = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getGraficasApk($idusuario, $iddominio, $idestructura, $fecha);
        return json_encode($r);

    }


    public function getReportesBusqueda($idusuario)
    {
      $dm = Doctrine_Manager::getInstance();
      $conn = $dm->getCurrentConnection();

      //$idusuario= $this->global->idusuario;

      $sql = "SELECT idbusqueda, codigo, denominacion, descripcion, configuracion, idconfiguracion
         FROM mod_reccomplejas2.dat_busqueda INNER JOIN mod_reccomplejas2.dat_busquedausuario bu USING(idbusqueda)
         WHERE idconfiguracion like 'personas' AND cantidad=1 AND bu.idusuario = $idusuario;";
        $r = $conn->fetchAll($sql);
        
        return json_encode($r);

    }

  public function ejecutarReportesBusqueda($idbusqueda, $idusuario)
  {
	
	try{
		$r = ZendExt_IoC::getInstance()->reccomplejas->getEjecutarBusquedaAvanzada($idbusqueda, $idusuario);
		return json_encode($r);	
	}
	catch(Exception $e){
		return json_encode($e->getMessage());
	}
  }
}
