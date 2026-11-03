<?php
class DatPersonaentidad extends BaseDatPersonaentidad
{
    //protected $objEstructuraService;

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomMotivobaja', array('local' => 'idmotivobaja', 'foreign' => 'idmotivobaja'));
        $this->hasMany('DatSituacionlaboral', array('local' => 'idpersonaentidad', 'foreign' => 'idpersonaentidad'));
        //$this->hasMany('DatReserva', array('local' => 'idpersonaentidad', 'foreign' => 'idpersonaentidad'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @params $idpersonaentidad
     * @return Doctrine_Record
     */
    public function getById($idpersonaentidad)
    {
        return Doctrine::getTable('DatPersonaentidad')->find($idpersonaentidad);
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @params $idpersona
     * @params $identidad
     * @return Doctrine_Record
     */
    public function getByIdPersona($idpersona, $identidad)
    {
        $query = Doctrine_Query::create()
            ->select("pe.idpersonaentidad")
            ->from('DatPersonaentidad pe')
            ->where(
                "pe.identidad = '$identidad'
                AND pe.idpersona = '$idpersona'
                AND (now() <= pe.fhasta OR pe.fhasta is null)"
            );
        return $query->execute()->toArray();
    }

    public function getExistenciaFTByIdCargo($cargos)
    {
        $sql = "SELECT
                sl.*              
              , pe.identidad
              , pe.fdesde as falta
              , pe.fhasta as fbaja
              , pe.idprocedenciasocial as idprocedencia
              , ident.numero AS numid
              , dp.sexo
              , dp.nombre
              , dp.snombre
              , dp.papel
              , dp.sapel
              , dp.idsuin
              , est.codigo as reup
              , area.denominacion as area
              , ueb.denominacion as denomueb
              , pl.denominacion as actfundamental
              , dc.idnomcargo
              FROM mod_persona.dat_situacionlaboral AS sl
              INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
              INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
              LEFT JOIN mod_persona.dat_docidentidad AS ident ON (dp.idpersona = ident.idpersona AND ident.principal = 1
                  AND (ident.fhasta > now() OR ident.fhasta IS NULL))	
              INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)    
              LEFT JOIN mod_fuerzatrabajo.nom_programalaboral AS pl ON (sl.idprogramalaboral = pl.idprogramalaboral)
              INNER JOIN mod_estructuracomp.dat_estructura AS est ON (est.idestructura = pe.identidad AND est.idproyecto = 0)
              INNER JOIN mod_estructuracomp.dat_estructuraop AS area ON (area.idestructuraop = sl.idarea AND area.idproyecto = 0)
              LEFT JOIN mod_estructuracomp.dat_estructuraop AS ueb ON (ueb.idestructuraop = sl.ueb AND UEB.idproyecto = 0)
              WHERE dp.feliminado IS NULL AND (sl.estado = 0 OR sl.fhasta > now()) 
                AND sl.idcargo in (" . implode(',', $cargos) . ") ORDER BY pe.identidad";


        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    /**
     * @method getTotalPorSexo - Devuelve el total de trabajadores por sexo
     * dada una estructura.
     * @params $idestructura - Identificador de la estructura.
     * @return Array - Arreglo con los totales de personas por sexo.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getTotalPorSexo($idestructura)
    {
        $sql = "SELECT
          'Total de trabajadores' AS agrupador,
          1 AS tipo,
          CASE WHEN sexo = 1 THEN 'Masculino' ELSE 'Femenino' END AS indicador,
          count(dpe.idpersona) AS cantidad
          FROM mod_persona.dat_situacionlaboral AS dsl
          INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersonaentidad = dsl.idpersonaentidad)
          INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona)
          INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
          WHERE dp.feliminado IS NULL AND dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > now())";
        if(!empty($idestructura)) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            $idcargos = Array();
            foreach ($cargos as $key => $value) {
                array_push($idcargos, $value['idcargo']);
            }
            $sql .= " AND dsl.idcargo in (" . implode(',', $idcargos) . ")";
        }
        //Concatenando al SQL la sentencia GROUP BY
        $sql = $sql." GROUP BY sexo";
        //Obteniendo la conexión a la base de datos
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        //Ejecutando la consulta SQL y retornando el resultado.
        return $conn->fetchAll($sql);
    }

    /**
     * @method getTotalPorEdades - Devuelve el total de trabajadores por edades
     * dada una estructura.
     * @params $idestructura - Identificador de la estructura.
     * @return Array - Arreglo con los totales de personas por edades.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getTotalPorEdades($idestructura)
    {
        $sql = "SELECT
          date_part('year',age(ddn.fechanacimiento)) AS edad,
          count(dpe.idpersona) AS cantidad
          FROM mod_persona.dat_situacionlaboral AS dsl
          INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersonaentidad = dsl.idpersonaentidad)
          INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona)
          LEFT JOIN mod_persona.dat_datosnacimiento AS ddn ON (ddn.idpersona = dp.idpersona)
          WHERE dp.feliminado IS NULL  AND dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > now())";
        if(!empty($idestructura)) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            $idcargos = Array();
            foreach ($cargos as $key => $value) {
                array_push($idcargos, $value['idcargo']);
            }
            $sql .= " AND dsl.idcargo in (" . implode(',', $idcargos) . ")";
        }
        $sql = $sql." GROUP BY edad";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    /**
     * @method getResumenPorProcedencia - Devuelve el total de trabajadores
     * por procedencia.
     * @params $idestructura - Identificador de la estructura.
     * @params $fdesde - Fecha en que inicia el periodo a analizar.
     * @params $fhasta - Fecha en que concluye el periodo a analizar.
     * @return Array - Arreglo con los totales de personas por procedencia.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getResumenPorProcedencia($idestructura)
    {
        $sql = "SELECT
        'Distribución de trabajadores por procedencia' AS agrupador,
        1 AS tipo,
        CASE WHEN nps.denominacion IS NULL THEN 'No conocido' ELSE nps.denominacion END AS indicador,
        count(dpe.idpersona) AS cantidad
        FROM mod_persona.dat_situacionlaboral AS dsl
        INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersonaentidad = dsl.idpersonaentidad)
        INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona)
        LEFT JOIN mod_fuerzatrabajo.nom_procedenciasocial AS nps ON (nps.idprocedenciasocial = dpe.idprocedenciasocial)
        WHERE dp.feliminado IS NULL AND (dsl.fhasta IS NULL OR dsl.fhasta > now())";
        if(!empty($idestructura)) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            $idcargos = Array();
            foreach ($cargos as $key => $value) {
                array_push($idcargos, $value['idcargo']);
            }
            $sql .= " AND dsl.idcargo in (" . implode(',', $idcargos) . ")";
        }
        $sql = $sql." GROUP BY indicador";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    /**
     * @method getTrayectoriaAltas - Devuelve la trayectoria de las altas por
     * procedencia.
     * @params $idestructura - Identificador de la estructura.
     * @return Array - Arreglo con los totales de personas por procedencia.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getTrayectoriaAltas()
    {
        $sql = "SELECT
        substring(dpe.fdesde::VARCHAR, 7, 4) AS anno,
        CASE WHEN ps.denominacion IS NULL THEN 'No conocido' ELSE ps.denominacion END AS indicador,
        count(dpe.idpersona) AS cantidad
        FROM mod_persona.dat_personaentidad AS dpe
        INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona)
        LEFT JOIN mod_fuerzatrabajo.nom_procedenciasocial AS ps ON (ps.idprocedenciasocial = dpe.idprocedenciasocial)";
        $sql = $sql." GROUP BY indicador, anno";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function buscarPersona($numid, $idsuin)
    {
        $sqlBuscarnumid = "SELECT p.*, dd.numero    
                        FROM mod_persona.dat_persona as p                                
                        INNER JOIN mod_persona.dat_docidentidad as dd ON (dd.idpersona = p.idpersona)
                        WHERE dd.idtipodocidentidad = 1 AND dd.numero = '$numid'";
        if (!empty($idsuin)) {
            $sqlBuscarnumid .= " AND p.idsuin = '$idsuin'";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $existe = $conn->fetchAll($sqlBuscarnumid);
        return $existe;
    }

    public function addPersona($nombre, $snombre, $papel, $sapel, $sexo, $idsuin) {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        //$conn->beginTransaction();
        $sqlinsert = "INSERT INTO mod_persona.dat_persona(nombre, snombre, papel, sapel, sexo, idsuin)
            VALUES ('$nombre', '$snombre', '$papel', '$sapel', $sexo, '$idsuin') returning idpersona;";
        $r = $conn->fetchAll($sqlinsert);
        //$conn->commit();
        return $r[0]['idpersona'];
    }

    public function addCIPersona($idpersona, $numid)
    {
        $sqldoc = "INSERT INTO mod_persona.dat_docidentidad(idpersona, idtipodocidentidad, numero, principal)
                    VALUES ($idpersona, 1, $numid, 1);";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $conn->execute($sqldoc);
        return true;
    }

    public function addSitLabDirecto($idpersonaentidad, $datos)
    {
        $sqldoc = "INSERT INTO mod_persona.dat_situacionlaboral(idcargo, idsituacion, fdesde, fhasta, idpersonaentidad, 
                    idarea, idtipocontrato, idmotivo, estado, noalta, principal, idespcargo, ueb, idprogramalaboral, 
                    idmodalidadempleo)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $conn->execute($sqldoc, array($datos['idcargo'], $datos['idsituacion'], $datos['fdesde'], $datos['fhasta'],
            $idpersonaentidad, $datos['idarea'], $datos['idtipocontrato'], $datos['idmotivo'], $datos['estado'],
            $datos['noalta'], $datos['principal'], $datos['idespcargo'], $datos['ueb'], $datos['idprogramalaboral'],
            $datos['idmodalidadempleo']));
        return true;
    }

    public function esCuadro($idcargo)
    {
        $query = "SELECT COUNT(c.idcategocup) AS cant
                  FROM mod_estructuracomp.dat_cargocivil AS dc
                  LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS c ON(dc.idcategocup=c.idcategocup)
                  WHERE dc.idcargo = $idcargo AND c.idcategoriareporte = 5 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $r = $conn->fetchAll($query);
        if ($r[0]['cant'] == 1) {
            return 1;
        } else {
            return 0;
        }
    }
}
