<?php
    /**
     * @name MovimientonaminalModel - Clase de lógica de negocio del reporte de movimiento de nomina.
     * @package movimientoslaborales.
     * @copyright XETID.
     * @author Centro RRHH. División Gestión de Entidades. XETID.
     * @version 1.0
    */
$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);
class PDFAnexo2 extends fpdf
{
    private $pdf;
    private $table;
    private $alingsArray;
    function Footer()
    {

    }
}
class Anexo2Model extends ZendExt_Model
{
    /**
     * @method Anexo2Model - Constructor de la clase.
     * @author Osiel Fundora Ramírez.

   **/
//Consultas
    public function directivoNS($estructura){

        $sql = "SELECT count(dp.idpersona) as id
From mod_persona.dat_personaentidad as dp
INNER JOIN mod_persona.dat_situacionlaboral as ds on (dp.idpersonaentidad = ds.idpersonaentidad)
INNER JOIN mod_estructuracomp.dat_cargo as dcc on (ds.idcargo = dcc.idcargo and dcc.idproyecto = 0)
INNER JOIN mod_estructuracomp.nom_preparacion as np on (dcc.idpreparacion = np.idpreparacion)
INNER JOIN mod_estructuracomp.dat_cargocivil as dc on (ds.idcargo = dc.idcargo and dc.idproyecto = 0)
INNER JOIN mod_estructuracomp.nom_categocup as nc on (dc.idcategocup = nc.idcategocup)
WHERE ds.principal = 1 and ds.idcargo is not null and ds.ueb is not null and ds.ueb = $estructura and nc.idcategocup = 6 and np.idpreparacion = 1";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function ejecutivoNS($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 8 and dc.idpreparacion = 1";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function tecnicoNS($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 4 and dc.idpreparacion = 1";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function administrativoNS($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 2 and dc.idpreparacion = 1";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function servicioNS($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 3 and dc.idpreparacion = 1";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function operarioNS($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 1 and dc.idpreparacion = 1";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function directivoNM($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 6 and dc.idpreparacion = 9";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function ejecutivoNM($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 8 and dc.idpreparacion = 9";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function tecnicoNM($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 4 and dc.idpreparacion = 9";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function administrativoNM($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 2 and dc.idpreparacion = 9";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function servicioNM($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 3 and dc.idpreparacion = 9";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function operarioNM($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 1 and dc.idpreparacion = 9";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function directivoOC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 6 and dc.idpreparacion = 0";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function ejecutivoOC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 8 and dc.idpreparacion = 0";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function tecnicoOC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 4 and dc.idpreparacion = 0";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function administrativoOC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 2 and dc.idpreparacion = 0";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function servicioOC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 3 and dc.idpreparacion = 0";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function operarioOC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 1 and dc.idpreparacion = 0";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function directivoSC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 6  and dc.idpreparacion = 10";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function ejecutivoSC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 8  and dc.idpreparacion = 10";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function tecnicoSC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 4  and dc.idpreparacion = 10";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function administrativoSC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 2  and dc.idpreparacion = 10";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function servicioSC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 3  and dc.idpreparacion = 10";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function operarioSC($estructura){

        $sql = "select count( nco.idcategocup ) as id
FROM mod_estructuracomp.dat_cargo AS dc
  INNER JOIN mod_estructuracomp.dat_cargocivil AS dcv USING (idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
  INNER JOIN mod_estructuracomp.nom_categocup AS nco ON(dcv.idcategocup = nco.idcategocup)
  INNER JOIN mod_estructuracomp.nom_preparacion AS npp ON (dc.idpreparacion = npp.idpreparacion)
  INNER JOIN mod_persona.dat_situacionlaboral AS dsl ON (dsl.idcargo = dc.idcargo)
  WHERE dsl.ueb = $estructura and nco.idcategocup = 1  and dc.idpreparacion = 10";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function denominacion($estructura){

        $sql = "select ec.denominacion from mod_estructuracomp.dat_estructuraop as ec where ec.idestructuraop = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function mujeresD($estructura){

        $sql = "SELECT
(CASE WHEN dp.sexo = 0 THEN count((CASE WHEN nc.idcategocup = 6 THEN 'E' END)) END) as dirm
FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
     inner join mod_persona.dat_persona dp on (dp.idpersona = dpe.idpersona)
    where sit.ueb = $estructura
     group by  dp.sexo ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function mujeresE($estructura){

        $sql = "SELECT

(CASE WHEN dp.sexo = 0 THEN count((CASE WHEN nc.idcategocup = 8 THEN 'E' END)) END) as dirm
FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
     inner join mod_persona.dat_persona dp on (dp.idpersona = dpe.idpersona)
    where sit.ueb = $estructura
     group by  dp.sexo ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function mujeresT($estructura){

        $sql = "SELECT

(CASE WHEN dp.sexo = 0 THEN count((CASE WHEN nc.idcategocup = 4 THEN 'E' END)) END) as dirm
FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
     inner join mod_persona.dat_persona dp on (dp.idpersona = dpe.idpersona)
    where sit.ueb = $estructura
     group by  dp.sexo ";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function mujeresA($estructura){

    $sql = "SELECT

(CASE WHEN dp.sexo = 0 THEN count((CASE WHEN nc.idcategocup = 2 THEN 'E' END)) END) as dirm
FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
     inner join mod_persona.dat_persona dp on (dp.idpersona = dpe.idpersona)
    where sit.ueb = $estructura
     group by  dp.sexo ";
    $dm = Doctrine_Manager::getInstance();
    $conn = $dm->getCurrentConnection();
    return $conn->fetchAll($sql);
}
    public function mujeresS($estructura){

        $sql = "SELECT

(CASE WHEN dp.sexo = 0 THEN count((CASE WHEN nc.idcategocup = 3 THEN 'E' END)) END) as dirm
FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
     inner join mod_persona.dat_persona dp on (dp.idpersona = dpe.idpersona)
    where sit.ueb = $estructura
     group by  dp.sexo ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function mujeresO($estructura){

        $sql = "SELECT

(CASE WHEN dp.sexo = 0 THEN count((CASE WHEN nc.idcategocup = 1 THEN 'E' END)) END) as dirm
FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
     inner join mod_persona.dat_persona dp on (dp.idpersona = dpe.idpersona)
    where sit.ueb = $estructura
     group by  dp.sexo ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function plantillaD($estructura){

    $sql = "select count((CASE WHEN nc.idcategocup = 6 THEN 'E' END))  as dirm
     FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup and dc.idproyecto = 0)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
        where sit.ueb = $estructura";
    $dm = Doctrine_Manager::getInstance();
    $conn = $dm->getCurrentConnection();
    return $conn->fetchAll($sql);
}
    public function plantillaE($estructura){

        $sql = "select count((CASE WHEN nc.idcategocup = 8 THEN 'E' END))  as dirm
     FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup and dc.idproyecto = 0)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
        where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function plantillaT($estructura){

        $sql = "select count((CASE WHEN nc.idcategocup = 4 THEN 'E' END))  as dirm
     FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup and dc.idproyecto = 0)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
        where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function plantillaA($estructura){

        $sql = "select count((CASE WHEN nc.idcategocup = 2 THEN 'E' END))  as dirm
     FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup and dc.idproyecto = 0)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
        where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function plantillaS($estructura){

        $sql = "select count((CASE WHEN nc.idcategocup = 3 THEN 'E' END))  as dirm
     FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
        where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function plantillaO($estructura){

        $sql = "select count((CASE WHEN nc.idcategocup = 1 THEN 'E' END))  as dirm
     FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
        where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSPD($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 1 THEN count((CASE WHEN nco.idcategocup = 6 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSPE($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 1 THEN count((CASE WHEN nco.idcategocup = 8 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSPT($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 1 THEN count((CASE WHEN nco.idcategocup = 4 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSPA($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 1 THEN count((CASE WHEN nco.idcategocup = 2 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSPS($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 1 THEN count((CASE WHEN nco.idcategocup = 3 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSPO($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 1 THEN count((CASE WHEN nco.idcategocup = 1 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSLJD($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 6 THEN count((CASE WHEN nco.idcategocup = 6 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSLJE($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 6 THEN count((CASE WHEN nco.idcategocup = 8 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSLJT($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 6 THEN count((CASE WHEN nco.idcategocup = 4 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSLJA($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 6 THEN count((CASE WHEN nco.idcategocup = 2 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSLJS($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 6 THEN count((CASE WHEN nco.idcategocup = 3 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasSLJO($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 6 THEN count((CASE WHEN nco.idcategocup = 1 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function bajasJFD($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 2 or nm.idmotivobaja = 3 THEN count((CASE WHEN nco.idcategocup = 6 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasJFE($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 2 or nm.idmotivobaja = 3 THEN count((CASE WHEN nco.idcategocup = 8 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasJFT($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 2 or nm.idmotivobaja = 3 THEN count((CASE WHEN nco.idcategocup = 4 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasJFA($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 2 or nm.idmotivobaja = 3 THEN count((CASE WHEN nco.idcategocup = 2 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasJFS($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 2 or nm.idmotivobaja = 3 THEN count((CASE WHEN nco.idcategocup = 3 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function bajasJFO($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 2 or nm.idmotivobaja = 3 THEN count((CASE WHEN nco.idcategocup = 1 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function bajasOD($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 7 THEN count((CASE WHEN nco.idcategocup = 6 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function bajasOE($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 7 THEN count((CASE WHEN nco.idcategocup = 8 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function bajasOT($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 7 THEN count((CASE WHEN nco.idcategocup = 4 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function bajasOA($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 7 THEN count((CASE WHEN nco.idcategocup = 2 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function bajasOS($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 7 THEN count((CASE WHEN nco.idcategocup = 3 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function bajasOO($estructura){

        $sql = "SELECT
     (CASE WHEN nm.idmotivobaja = 7 THEN count((CASE WHEN nco.idcategocup = 1 THEN 'D' END)) END) as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= nm.idmotivobaja and sit.estado = 2)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura
     Group by nm.idmotivobaja";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function movimientoD($estructura){

        $sql = "SELECT
     count((CASE WHEN nco.idcategocup = 6 THEN 'D' END))  as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= 7 and sit.estado = 1)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function movimientoE($estructura){

        $sql = "SELECT
     count((CASE WHEN nco.idcategocup = 8 THEN 'D' END))  as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= 7 and sit.estado = 1)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function movimientoT($estructura){

        $sql = "SELECT
     count((CASE WHEN nco.idcategocup = 4 THEN 'D' END))  as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= 7 and sit.estado = 1)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function movimientoA($estructura){

        $sql = "SELECT
     count((CASE WHEN nco.idcategocup = 2 THEN 'D' END))  as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= 7 and sit.estado = 1)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function movimientoS($estructura){

        $sql = "SELECT
     count((CASE WHEN nco.idcategocup = 3 THEN 'D' END))  as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= 7 and sit.estado = 1)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function movimientoO($estructura){

        $sql = "SELECT
     count((CASE WHEN nco.idcategocup = 1 THEN 'D' END))  as dirm
     FROM
     mod_fuerzatrabajo.nom_motivobaja as nm
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (sit.idmotivo= 7 and sit.estado = 1)
     INNER JOIN mod_persona.dat_personaentidad as pe ON ( pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_persona.dat_persona as p ON (pe.idpersona = p.idpersona)
      INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function altasdentroD($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 1 THEN count(p.idpersona) END) as dirm

FROM

     mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =1 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))

     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function altasdentroE($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 8 THEN count(p.idpersona) END) as dirm

FROM

     mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =1 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))

     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function altasdentroT($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 4 THEN count(p.idpersona) END) as dirm

FROM

     mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =1 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))

     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function altasdentroA($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 2 THEN count(p.idpersona) END) as dirm

FROM

     mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =1 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))

     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function altasdentroS($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 3 THEN count(p.idpersona) END) as dirm

FROM

     mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =1 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))

     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function altasdentroO($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 1 THEN count(p.idpersona) END) as dirm

FROM

     mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =1 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))

     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function altasfueraD($estructura){

    $sql = "SELECT

(CASE WHEN nco.idcategocup = 6 THEN count(p.idpersona) END) as dirm
FROM
      mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =0 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))
     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
    $dm = Doctrine_Manager::getInstance();
    $conn = $dm->getCurrentConnection();
    return $conn->fetchAll($sql);
}
    public function altasfueraE($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 8 THEN count(p.idpersona) END) as dirm
FROM
      mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =0 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))
     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function altasfueraT($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 4 THEN count(p.idpersona) END) as dirm
FROM
      mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =0 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))
     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function altasfueraA($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 2 THEN count(p.idpersona) END) as dirm
FROM
      mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =0 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))
     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function altasfueraS($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 3 THEN count(p.idpersona) END) as dirm
FROM
      mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =0 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))
     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function altasfueraO($estructura){

        $sql = "SELECT

(CASE WHEN nco.idcategocup = 1 THEN count(p.idpersona) END) as dirm
FROM
      mod_persona.dat_persona as p
     inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad and sit.estado =0 and (sit.fhasta > now()::date or sit.fhasta is null) and ((select extract(month from sit.fdesde)) = (select extract(month from now()::date)) )
     and ((select extract(year from sit.fdesde)) = (select extract(year from now()::date)) ) )
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup and (nco.fechainicio > now()::date or nco.fechafin is null))
     inner join mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
     where sit.ueb = $estructura
         group by nco.idcategocup";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobradirectaD($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 6 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 1
     group by dc.directo";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function manoobradirectaE($estructura){

        $sql = "SELECT
count((CASE WHEN nc.idcategocup = 8 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 1
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobradirectaT($estructura){

        $sql = "SELECT
count((CASE WHEN nc.idcategocup = 4 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 1
    ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function manoobradirectaA($estructura){

        $sql = "SELECT
count((CASE WHEN nc.idcategocup = 2 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 1
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobradirectaS($estructura){

        $sql = "SELECT
count((CASE WHEN nc.idcategocup = 3 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 1
    ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobradirectaO($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 1 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 1
    ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function manoobraindirectaD($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 6 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 0
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraindirectaE($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 8 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 0
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraindirectaT($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 4 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 0
    ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraindirectaA($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 2 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 0
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraindirectaS($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 3 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 0
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraindirectaO($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 1 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura and dc.directo = 0   ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraviviendaD($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 6 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 3 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraviviendaE($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 8 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 3 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraviviendaT($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 4 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 3 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraviviendaA($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 2 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 3 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraviviendaS($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 3 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 3 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraviviendaO($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 1 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 3 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraturismoD($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 6 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 4 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraturismoE($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 8 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 4 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraturismoT($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 4 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 4 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraturismoA($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 2 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 4 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraturismoS($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 3 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 4 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraturismoO($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 1 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 4 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraotrasD($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 6 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 5 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraotrasE($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 8 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 5 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraotrasT($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup =4 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 5 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraotrasA($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 2 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 5 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraotrasS($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 3 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 5 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function manoobraotrasO($estructura){

        $sql = "SELECT count((CASE WHEN nc.idcategocup = 1 THEN 'E' END))  as dirm
FROM
	mod_persona.dat_persona as p
    Inner Join mod_persona.dat_personaentidad as dpen on (dpen.idpersona = p.idpersona)
     Inner Join mod_persona.dat_situacionlaboral as sit on (sit.principal = 1 and sit.idpersonaentidad = dpen.idpersonaentidad)
      INNER JOIN mod_estructuracomp.dat_cargo as dc ON (sit.idcargo = dc.idcargo)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     Inner Join mod_estructuracomp.dat_cargocivil as dcc on (dc.idcargo = dcc.idcargo)
     Inner Join mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
     where sit.ueb = $estructura  and sit.idprogramalaboral = 5 ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function adiestradoD($estructura){

        $sql = "SELECT

    count((CASE WHEN nc.idcategocup = 6 THEN 'E' END))  as dirm
FROM
     mod_persona.dat_persona as p
      INNER JOIN mod_persona.dat_personaentidad as dpe ON (p.idpersona = dpe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dpe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nc ON (dcc.idcategocup = nc.idcategocup)
     where  sit.ueb = $estructura and nsit.idsituacion = 2";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function adiestradoE($estructura){

        $sql = "SELECT

    count((CASE WHEN nc.idcategocup = 8 THEN 'E' END))  as dirm
FROM
     mod_persona.dat_persona as p
      INNER JOIN mod_persona.dat_personaentidad as dpe ON (p.idpersona = dpe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dpe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nc ON (dcc.idcategocup = nc.idcategocup)
     where  sit.ueb = $estructura and nsit.idsituacion = 2
    ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function adiestradoT($estructura){

        $sql = "SELECT

    count((CASE WHEN nc.idcategocup = 4 THEN 'E' END))  as dirm
FROM
     mod_persona.dat_persona as p
      INNER JOIN mod_persona.dat_personaentidad as dpe ON (p.idpersona = dpe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dpe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nc ON (dcc.idcategocup = nc.idcategocup)
     where  sit.ueb = $estructura and nsit.idsituacion = 2
    ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function adiestradoA($estructura){

        $sql = "SELECT

    count((CASE WHEN nc.idcategocup = 2 THEN 'E' END))  as dirm
FROM
     mod_persona.dat_persona as p
      INNER JOIN mod_persona.dat_personaentidad as dpe ON (p.idpersona = dpe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dpe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nc ON (dcc.idcategocup = nc.idcategocup)
     where  sit.ueb = $estructura and nsit.idsituacion = 2
  ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function adiestradoS($estructura){

        $sql = "SELECT

    count((CASE WHEN nc.idcategocup = 3 THEN 'E' END))  as dirm
FROM
     mod_persona.dat_persona as p
      INNER JOIN mod_persona.dat_personaentidad as dpe ON (p.idpersona = dpe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dpe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nc ON (dcc.idcategocup = nc.idcategocup)
     where  sit.ueb = $estructura and nsit.idsituacion = 2
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function adiestradoO($estructura){

        $sql = "SELECT

    count((CASE WHEN nc.idcategocup = 1 THEN 'E' END))  as dirm
FROM
     mod_persona.dat_persona as p
      INNER JOIN mod_persona.dat_personaentidad as dpe ON (p.idpersona = dpe.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dpe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1)
     INNER JOIN mod_persona.nom_situacion as nsit ON (sit.idsituacion = nsit.idsituacion)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nc ON (dcc.idcategocup = nc.idcategocup)
     where  sit.ueb = $estructura and nsit.idsituacion = 2
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function acidenteD($estructura){

        $sql = " SELECT
  count((CASE WHEN nco.idcategocup = '6' THEN 'D' END)) as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 103 and sit.ueb = $estructura
   ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function acidenteE($estructura){

        $sql = "SELECT
  count((CASE WHEN nco.idcategocup = '8' THEN 'D' END))  as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 103 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function acidenteT($estructura){

        $sql = "SELECT
  count((CASE WHEN nco.idcategocup = '4' THEN 'D' END))  as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 103 and sit.ueb = $estructura
   ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function acidenteA($estructura){

        $sql = "SELECT
  count((CASE WHEN nco.idcategocup = '2' THEN 'D' END)) as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 103 AND sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function acidenteS($estructura){

        $sql = "SELECT
  count((CASE WHEN nco.idcategocup = 3 THEN 'D' END))  as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 103 and  sit.ueb = $estructura
    ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function acidenteO($estructura){

        $sql = "SELECT
 count((CASE WHEN nco.idcategocup = '1' THEN 'D' END)) as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where  causa.idcausa = 103 AND sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function enfermedadD($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '6' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 98 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function enfermedadE($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '8' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 98 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function enfermedadT($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '4' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 98 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function enfermedadA($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '2' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 98 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function enfermedadS($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '3' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 98 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function enfermedadO($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '1' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 98 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function licenciaSSD($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '6' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 97 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function licenciaSSE($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '8' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 97 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function licenciaSST($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '4' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 97 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function licenciaSSA($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '2' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 97 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function licenciaSSS($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '3' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 97 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function licenciaSSO($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '1' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 97 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function obligacionesD($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '6' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 100 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function obligacionesE($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '8' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 100 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function obligacionesT($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '4' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 100 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function obligacionesA($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '2' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 100 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function obligacionesS($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '3' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 100 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function obligacionesO($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '1' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 100 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function autorizadosD($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '6' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 101 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function autorizadosE($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '8' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 101 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function autorizadosT($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '4' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 101 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function autorizadosA($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '2' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 101 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function autorizadosS($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '3' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 101 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function autorizadosO($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '1' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 101 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function injustificadosD($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '6' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 95 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function injustificadosE($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '8' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 95 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function injustificadosT($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '4' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 95 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function injustificadosA($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '2' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 95 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function injustificadosS($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '3' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 95 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function injustificadosO($estructura){

        $sql = "SELECT       count((CASE WHEN nco.idcategocup = '1' THEN 'D' END))as dirm

FROM
     mod_regimentrabajo.nom_causa as causa
     Inner join  mod_regimentrabajo.dat_asistencia as asis on (asis.idcausa = causa.idcausa)
     INNER JOIN mod_persona.dat_persona as p ON (asis.idpersona = p.idpersona)
     Inner join mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (pe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_cargocivil as dcc ON (sit.idcargo = dcc.idcargo)
     INNER JOIN mod_estructuracomp.nom_categocup as nco ON (dcc.idcategocup = nco.idcategocup)
     where causa.idcausa = 95 and sit.ueb = $estructura
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function plantillageneralD($estructura){

        $sql = "select


count (nc.denominacion )as cargo
  FROM mod_estructuracomp.nom_filaestruc as nfe
  INNER JOIN mod_estructuracomp.dat_cargo as dc on (nfe.idfila=dc.idcargo and dc.idproyecto = 0)
  INNER JOIN mod_estructuracomp.nom_cargo as nc on (dc.idnomcargo=nc.idnomcargo)
  left JOIN mod_estructuracomp.dat_cargocivil as dcc on (dcc.idcargo = dc.idcargo)
  left JOIN mod_estructuracomp.nom_categocup as nco on (dcc.idcategocup = nco.idcategocup)

  where
   ( nfe.lft > (select lft from mod_estructuracomp.nom_filaestruc where idfila = $estructura)
       and nfe.rgt < (select rgt from mod_estructuracomp.nom_filaestruc where idfila = $estructura) )
and nco.idcategocup = 6
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function plantillageneralE($estructura){

        $sql = "select


count (nc.denominacion )as cargo
  FROM mod_estructuracomp.nom_filaestruc as nfe
  INNER JOIN mod_estructuracomp.dat_cargo as dc on (nfe.idfila=dc.idcargo and dc.idproyecto = 0)
  INNER JOIN mod_estructuracomp.nom_cargo as nc on (dc.idnomcargo=nc.idnomcargo)
  left JOIN mod_estructuracomp.dat_cargocivil as dcc on (dcc.idcargo = dc.idcargo)
  left JOIN mod_estructuracomp.nom_categocup as nco on (dcc.idcategocup = nco.idcategocup)

  where
   ( nfe.lft > (select lft from mod_estructuracomp.nom_filaestruc where idfila = $estructura)
       and nfe.rgt < (select rgt from mod_estructuracomp.nom_filaestruc where idfila = $estructura) )
and nco.idcategocup = 8
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function plantillageneralT($estructura){

        $sql = "select count((CASE WHEN nc.idcategocup = 4 THEN 'E' END))  as dirm
     FROM
     mod_estructuracomp.nom_categocup as nc
     INNER JOIN mod_estructuracomp.dat_cargocivil as dc ON (nc.idcategocup = dc.idcategocup and dc.idproyecto = 0)
     INNER JOIN mod_persona.dat_situacionlaboral as sit ON (dc.idcargo = sit.idcargo and (sit.principal = 1))
     inner join mod_persona.dat_personaentidad as dpe on (dpe.idpersonaentidad = sit.idpersonaentidad)
     INNER JOIN mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
        where ec.idestructuraop = 100530382
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function plantillageneralA($estructura){

        $sql = "select


count (nc.denominacion )as cargo
  FROM mod_estructuracomp.nom_filaestruc as nfe
  INNER JOIN mod_estructuracomp.dat_cargo as dc on (nfe.idfila=dc.idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo as nc on (dc.idnomcargo=nc.idnomcargo)
  left JOIN mod_estructuracomp.dat_cargocivil as dcc on (dcc.idcargo = dc.idcargo)
  left JOIN mod_estructuracomp.nom_categocup as nco on (dcc.idcategocup = nco.idcategocup)

  where
   ( nfe.lft > (select lft from mod_estructuracomp.nom_filaestruc where idfila = $estructura)
       and nfe.rgt < (select rgt from mod_estructuracomp.nom_filaestruc where idfila = $estructura) )
and nco.idcategocup = 2
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function plantillageneralS($estructura){

        $sql = "select


count (nc.denominacion )as cargo
  FROM mod_estructuracomp.nom_filaestruc as nfe
  INNER JOIN mod_estructuracomp.dat_cargo as dc on (nfe.idfila=dc.idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo as nc on (dc.idnomcargo=nc.idnomcargo)
  left JOIN mod_estructuracomp.dat_cargocivil as dcc on (dcc.idcargo = dc.idcargo)
  left JOIN mod_estructuracomp.nom_categocup as nco on (dcc.idcategocup = nco.idcategocup)

  where
   ( nfe.lft > (select lft from mod_estructuracomp.nom_filaestruc where idfila = $estructura)
       and nfe.rgt < (select rgt from mod_estructuracomp.nom_filaestruc where idfila = $estructura) )
and nco.idcategocup = 3
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function plantillageneralO($estructura){

        $sql = "select


count (nc.denominacion )as cargo
  FROM mod_estructuracomp.nom_filaestruc as nfe
  INNER JOIN mod_estructuracomp.dat_cargo as dc on (nfe.idfila=dc.idcargo)
  INNER JOIN mod_estructuracomp.nom_cargo as nc on (dc.idnomcargo=nc.idnomcargo)
  left JOIN mod_estructuracomp.dat_cargocivil as dcc on (dcc.idcargo = dc.idcargo)
  left JOIN mod_estructuracomp.nom_categocup as nco on (dcc.idcategocup = nco.idcategocup)

  where
   ( nfe.lft > (select lft from mod_estructuracomp.nom_filaestruc where idfila = $estructura)
       and nfe.rgt < (select rgt from mod_estructuracomp.nom_filaestruc where idfila = $estructura) )
and nco.idcategocup = 1
     ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }












    //Reporte
   public function exportarestado( $estructura){
         $pdf = new fpdf('L', 'mm', array(440,560));
         $pdf->SetTitle("Anexo 2");
         $pdf->SetAuthor("Ing. Osiel Fundora Ramírez");
         $pdf->SetLeftMargin(2);
         $pdf->AddPage();
         $pdf->SetFont('Arial', 'B', 20);
       //var_dump($estructura);die;
if($estructura == null)
{$pdffinal = $this->cabeceraReporte2($pdf,    $estructura);

    $pdffinal->Output();
}
else{
    $pdffinal = $this->cabeceraReporte($pdf,    $estructura);

    $pdffinal->Output();
}


     }
         public function cabeceraReporte($pdf,   $estructura)
     {
$denominacion = $this->denominacion($estructura);
         $deno = $denominacion[0]['denominacion'];

//variables
             $tec = utf8_decode('Técnico');
             //primera fila
             $NSdirectivo = $this->directivoNS($estructura);
             $totalNSdirectivo = $NSdirectivo[0]['id'];
             $NSejecutivo = $this->ejecutivoNS($estructura);
             $totalNSejecutivo = $NSejecutivo[0]['id'];
             $NStecnico = $this->tecnicoNS($estructura);
             $totalNStecnico = $NStecnico[0]['id'];
             $NSAdministrativo = $this->administrativoNS($estructura);
             $totalNSadministrativo = $NSAdministrativo[0]['id'];
             $NSServicioNS = $this->servicioNS($estructura);
             $totalNSservicio = $NSServicioNS[0]['id'];
             $NSoperario = $this->operarioNS($estructura);
             $totalNSoperario = $NSoperario[0]['id'];
             $totalNS = $totalNSdirectivo+$totalNSejecutivo+$totalNStecnico+$totalNSadministrativo+$totalNSservicio+$totalNSoperario;
//segunda fila
             $NMdirectivo = $this->directivoNM($estructura);
             $totalNMdirectivo = $NMdirectivo[0]['id'];
             $NMejecutivo = $this->ejecutivoNM($estructura);
             $totalNMejecutivo = $NMejecutivo[0]['id'];
             $NMtecnico = $this->tecnicoNM($estructura);
             $totalNMtecnico = $NMtecnico[0]['id'];
             $NMadministrativo = $this->administrativoNM($estructura);
             $totalNMadministrativo = $NMadministrativo[0]['id'];
             $NMservicio = $this->servicioNM($estructura);
             $totalNMservicio = $NMservicio[0]['id'];
             $NMoperario = $this->operarioNM($estructura);
             $totalNMoperario = $NMoperario[0]['id'];
             $totalNM = $totalNMdirectivo+$totalNMejecutivo+$totalNMtecnico+$totalNMadministrativo+$totalNMservicio+$totalNMoperario;
//tercera fila

             $OCdirectivo = $this->directivoOC($estructura);
             $totalOCdirectivo = $OCdirectivo[0]['id'];
             $OCejecutivo = $this->ejecutivoOC($estructura);
             $totalOCejecutivo = $OCejecutivo[0]['id'];
             $OCtecnico = $this->tecnicoOC($estructura);
             $totalOCtecnico = $OCtecnico[0]['id'];
             $OCadministrativo = $this->administrativoOC($estructura);
             $totalOCadministrativo = $OCadministrativo[0]['id'];
             $OCservicio = $this->servicioOC($estructura);
             $totalOCservicio = $OCservicio[0]['id'];
             $OCoperario = $this->operarioOC($estructura);
             $totalOCoperario = $OCoperario[0]['id'];
             $totalobrero = $totalOCdirectivo+$totalOCejecutivo+$totalOCtecnico+$totalOCadministrativo+$totalOCservicio+$totalOCoperario;

        //cuarta fila
             $SCdirctivo = $this->directivoSC($estructura);
             $totalSCdirectivo = $SCdirctivo[0]['id'];
             $SCejecutivo = $this->ejecutivoSC($estructura);
             $totalejecutivo = $SCejecutivo[0]['id'];
             $SCtecnico = $this->tecnicoSC($estructura);
             $totalSCtecnico = $SCtecnico[0]['id'];
             $SCadministrativo = $this->administrativoSC($estructura);
             $totalSCadministrativo = $SCadministrativo[0]['id'];
             $SCservicio= $this->servicioSC($estructura);
             $totalSCservicio =  $SCservicio[0]['id'];
             $SCoperario = $this->operarioSC($estructura);
             $totalSCoperario = $SCoperario[0]['id'];
             $totalSC = $totalSCdirectivo+$totalejecutivo+$totalSCtecnico+$totalSCadministrativo+$totalSCservicio+$totalSCoperario;
//totales primer reporte

             $totaldirectivo = $totalNSdirectivo+$totalOCdirectivo+$totalNMdirectivo+$totalSCdirectivo;
             $totalejecutivo = $totalejecutivo+$totalOCejecutivo+$totalNMejecutivo+$totalNSejecutivo;
             $totaltecnico = $totalSCtecnico+$totalOCtecnico+$totalNMtecnico+$totalNStecnico;
             $totaladministrativo = $totalSCadministrativo+$totalOCadministrativo+$totalNMadministrativo+$totalNSadministrativo;
             $totalservicio = $totalSCservicio+$totalOCservicio+$totalNMservicio+$totalNSservicio;
             $totaloperario = $totalSCoperario+$totalOCoperario+$totalNMoperario+$totalNSoperario;
             $totalgeneral = $totaldirectivo+$totalejecutivo+$totaltecnico+$totaladministrativo+$totalservicio+$totaloperario;

//sexta fila
             $plantillad = $this->plantillaD($estructura);
             $totalpd = $plantillad[0]['dirm'];
             $plantillae = $this->plantillaE($estructura);
             $totalpe = $plantillae[0]['dirm'];
             $plantillat = $this->plantillaT($estructura);
             $totalpt = $plantillat[0]['dirm'];
             $plantillaa = $this->plantillaA($estructura);
             $totalpa = $plantillaa [0]['dirm'];
             $plantillas = $this->plantillaS($estructura);
             $totalps= $plantillas[0]['dirm'];
             $plantillao = $this->plantillaO($estructura);
             $totalpo = $plantillao[0]['dirm'];
$totalplantillaprobada = $totalpo+$totalps+$totalpa+$totalpt+$totalpe+$totalpd;
        //septima fila

             $mujeresD = $this->mujeresD($estructura);
             $totalmd = $mujeresD[0]['dirm'];
             if($totalmd == null){
                 $totalmd = 0;
             }
             $mujerese = $this->mujeresE($estructura);
             $totalme = $mujerese[0]['dirm'];
             if($totalme == null){
                 $totalme = 0;
             }
             $mujeresa = $this->mujeresA($estructura);
             $totalma = $mujeresa[0]['dirm'];
             if($totalma == null){
                 $totalma = 0;
             }
             $mujerest = $this->mujeresT($estructura);
             $totalmt = $mujerest[0]['dirm'];
             if($totalmt == null){
                 $totalmt = 0;
             }
             $mujeress = $this->mujeresS($estructura);
             $totalms = $mujeress[0]['dirm'];
             if($totalms == null){
                 $totalms = 0;
             }
             $mujereso = $this->mujeresO($estructura);
             $totalmo = $mujereso[0]['dirm'];
             if($totalmo == null){
                 $totalmo = 0;
             }
             $totalmujeres = $totalmo+$totalms+$totalmt+$totalma+$totalme+$totalmd;


             //novena fila
             $bajasSPD = $this->bajasSPD($estructura);
             $totalbspd = $bajasSPD[0]['dirm'];
             if($totalbspd == null){
                 $totalbspd = 0;
             }
             $bajasSPE = $this->bajasSPE($estructura);
             $totalbspe = $bajasSPE[0]['dirm'];
             if($totalbspe == null){
                 $totalbspe = 0;
             }
             $bajasSPT = $this->bajasSPT($estructura);
             $totalbspt = $bajasSPT[0]['dirm'];
             if($totalbspt == null){
                 $totalbspt = 0;
             }
             $bajasSPA = $this->bajasSPA($estructura);
             $totalbspa = $bajasSPA[0]['dirm'];
             if($totalbspa == null){
                 $totalbspa = 0;
             }
             $bajasSPS = $this->bajasSPS($estructura);
             $totalbsps = $bajasSPS[0]['dirm'];
             if($totalbsps == null){
                 $totalbsps = 0;
             }
             $bajasSPO = $this->bajasSPO($estructura);
             $totalbspo = $bajasSPO[0]['dirm'];
             if($totalbspo == null){
                 $totalbspo = 0;
             }
             $totalbajassolicitudpropia = $totalbspo+$totalbsps+$totalbspa+$totalbspt+$totalbspe+$totalbspd;
//decima fila
             $bajasSJPD = $this->bajasSLJD($estructura);
             $totalbsljd = $bajasSJPD[0]['dirm'];
             if($totalbsljd == null){
                 $totalbsljd = 0;
             }
             $bajasSJPE = $this->bajasSLJE($estructura);
             $totalbslje = $bajasSJPE[0]['dirm'];
             if($totalbslje == null){
                 $totalbslje = 0;
             }
             $bajasSJPT = $this->bajasSLJT($estructura);
             $totalbsljt = $bajasSJPT[0]['dirm'];
             if($totalbsljt == null){
                 $totalbsljt = 0;
             }
             $bajasSJPA = $this->bajasSLJA($estructura);
             $totalbslja = $bajasSJPA[0]['dirm'];
             if($totalbslja == null){
                 $totalbslja = 0;
             }
             $bajasSJPS = $this->bajasSLJS($estructura);
             $totalbsljs = $bajasSJPS[0]['dirm'];
             if($totalbsljs == null){
                 $totalbsljs = 0;
             }
             $bajasSJPO = $this->bajasSLJO($estructura);
             $totalbsljo = $bajasSJPO[0]['dirm'];
             if($totalbsljo == null){
                 $totalbsljo = 0;
             }
$totalbajassancion = $totalbsljo+$totalbsljs+$totalbslja+$totalbsljt+$totalbslje+$totalbsljd;
            //oncena fila
             $bajasJFD = $this->bajasJFD($estructura);
             $totalbjfd = $bajasJFD[0]['dirm'];
             if($totalbjfd== null){
                 $totalbjfd = 0;
             }
             $bajasJFE = $this->bajasJFE($estructura);
             $totalbjfe = $bajasJFE[0]['dirm'];
             if($totalbjfe== null){
                 $totalbjfe = 0;
             }
             $bajasJFT = $this->bajasJFT($estructura);
             $totalbjft = $bajasJFT[0]['dirm'];
             if($totalbjft== null){
                 $totalbjft = 0;
             }
             $bajasJFA = $this->bajasJFA($estructura);
             $totalbjfa = $bajasJFA[0]['dirm'];
             if($totalbjfa== null){
                 $totalbjfa = 0;
             }
             $bajasJFS = $this->bajasJFS($estructura);
             $totalbjfs = $bajasJFS[0]['dirm'];
             if($totalbjfs== null){
                 $totalbjfs = 0;
             }
             $bajasJFO = $this->bajasJFO($estructura);
             $totalbjfo = $bajasJFO[0]['dirm'];
             if($totalbjfo== null){
                 $totalbjfo = 0;
             }
$totalbajasJF = $totalbjfo+$totalbjfs+$totalbjfa+$totalbjft+$totalbjfe+$totalbjfd;

//decimosegunda fila

             $movimientoD = $this->movimientoD($estructura);
             $totalmovD = $movimientoD[0]['dirm'];
             $movimvientoE = $this->movimientoE($estructura);
             $totalmovE = $movimvientoE[0]['dirm'];
             $movimientoT =$this->movimientoT($estructura);
             $totalmovT = $movimientoT[0]['dirm'];
$movimientoA = $this->movimientoA($estructura);
             $totalmovA = $movimientoA[0]['dirm'];
             $movimientoS = $this->movimientoS($estructura);
             $totalmovS = $movimientoS[0]['dirm'];
             $movimientoO = $this->movimientoO($estructura);
             $totalmovO = $movimientoO[0]['dirm'];
             $totalmovimiento = $totalmovO+$totalmovS+$totalmovA+$totalmovT+$totalmovE+$totalmovD;


             //decimotercera fila
             $bajasOD = $this->bajasOD($estructura);
             $totalbod = $bajasOD[0]['id'];
             if($totalbod == null){
                 $totalbod = 0;
             }
             $bajasOE = $this->bajasOE($estructura);
             $totalboe = $bajasOE[0]['id'];
             if($totalboe == null){
                 $totalboe = 0;
             }
             $bajasOT = $this->bajasOT($estructura);
             $totalbot = $bajasOT[0]['id'];
             if($totalbot == null){
                 $totalbot = 0;
             }
             $bajasOA = $this->bajasOA($estructura);
             $totalboa = $bajasOA[0]['id'];
             if($totalboa == null){
                 $totalboa = 0;
             }
             $bajasOS = $this->bajasOS($estructura);
             $totalbos = $bajasOS[0]['id'];
             if($totalbos == null){
                 $totalbos = 0;
             }
             $bajasOO = $this->bajasOO($estructura);
             $totalboo = $bajasOO[0]['id'];
             if($totalboo == null){
                 $totalboo = 0;
             }
             $totalbajasotras = $totalboo+$totalbos+$totalboa+$totalbot+$totalboe+$totalbod;
             //octava fila
             $totalbajasdirectivo = $totalbspd+$totalbsljd+$totalbjfd+$totalbod+$totalmovD;
             $totalbajasejecutivo = $totalboe+$totalbjfe+$totalbslje+$totalmovE+$totalbspe;
             $totalbajastecnico = $totalbot+$totalbjft+$totalbsljt+$totalmovT+$totalbspt;
             $totalbajasadministrativo = $totalboa+$totalbjfa+$totalbslja+$totalmovA+$totalbspa;
             $totalbajasservicio = $totalbos+ $totalmovS+$totalbjfs+$totalbsljs+$totalbsps;
             $totalbajasoperario = $totalboo + $totalmovO+$totalbjfo+$totalbsljo+$totalbspo;
       $totalbajas = $totalbajassancion+$totalmovimiento+$totalbajasJF+$totalbajassolicitudpropia;


//decimo quinta
             $altaDED = $this->altasdentroD($estructura);
             $totalAltaDED = $altaDED[0]['dirm'];
             if($totalAltaDED == null){
                 $totalAltaDED=0;
             }
             $altaDEE = $this->altasdentroE($estructura);
             $totalAltaDEE = $altaDEE[0]['dirm'];
             if($totalAltaDEE == null){
                 $totalAltaDEE=0;
             }
             $altaDET = $this->altasdentroT($estructura);
             $totalAltaDET = $altaDET[0]['dirm'];
             if($totalAltaDET == null){
                 $totalAltaDET=0;
             }
             $altaDEA = $this->altasdentroA($estructura);
             $totalAltaDEA = $altaDEA[0]['dirm'];
             if($totalAltaDEA == null){
                 $totalAltaDEA=0;
             }
             $altaDES = $this->altasdentroS($estructura);
             $totalAltaDES = $altaDES[0]['dirm'];
             if($totalAltaDES == null){
                 $totalAltaDES=0;
             }
             $altaDEO = $this->altasdentroO($estructura);
             $totalAltaDEO = $altaDEO[0]['dirm'];
             if($totalAltaDEO == null){
                 $totalAltaDEO=0;
             }
$totalaltasdentroentidad = $totalAltaDEO+$totalAltaDES+$totalAltaDEA+$totalAltaDET+$totalAltaDEE+$totalAltaDED;
//decimo sexta
             $altafueraD = $this->altasfueraD($estructura);
             $totalaltasfD = $altafueraD[0]['dirm'];
             if($totalaltasfD == null){
                 $totalaltasfD = 0;
             }
             $altafueraE = $this->altasfueraE($estructura);
             $totalaltasfE = $altafueraE[0]['dirm'];
             if($totalaltasfE == null){
                 $totalaltasfE = 0;
             }
             $altafueraT = $this->altasfueraT($estructura);
             $totalaltasfT = $altafueraT[0]['dirm'];
             if($totalaltasfT == null){
                 $totalaltasfT = 0;
             }
             $altafueraA = $this->altasfueraA($estructura);
             $totalaltasfA = $altafueraA[0]['dirm'];
             if($totalaltasfA == null){
                 $totalaltasfA = 0;
             }
             $altafueraS = $this->altasfueraS($estructura);
             $totalaltasfS = $altafueraS[0]['dirm'];
             if($totalaltasfS == null){
                 $totalaltasfS = 0;
             }
             $altafueraO = $this->altasfueraO($estructura);
             $totalaltasfO = $altafueraO[0]['dirm'];
             if($totalaltasfO == null){
                 $totalaltasfO = 0;
             }
$totalaltasdentroorganismo = $totalaltasfO+$totalaltasfS+$totalaltasfA+$totalaltasfT+$totalaltasfE+$totalaltasfD;

             //altas totales
             $totalaltasdirectivos = $totalaltasfD+$totalAltaDED;
             $totalaltasejecutivos = $totalaltasfE+$totalAltaDEE;
             $totalaltastecnicos = $totalaltasfT+$totalAltaDET;
             $totalaltasadministrativos = $totalaltasfA+$totalAltaDEA;
             $totalaltasservicio = $totalaltasfS+$totalAltaDES;
             $totalaltasoperario = $totalaltasfO+$totalAltaDEO;
             $totalaltas = $totalaltasoperario+$totalaltasservicio+$totalaltasadministrativos+$totalaltastecnicos+$totalaltasejecutivos+$totalaltasdirectivos;
//decimo septima
             $manoDD = $this->manoobradirectaD($estructura);
             $totalmanoDD = $manoDD[0]['dirm'];
             if($totalmanoDD == null){
                 $totalmanoDD = 0;
             }
             $manodDE = $this->manoobradirectaE($estructura);
             $totalmanoDE = $manodDE[0]['dirm'];
             if($totalmanoDE == null){
                 $totalmanoDE = 0;
             }
             $manoDT = $this->manoobradirectaT($estructura);
             $totalmanoDT = $manoDT[0]['dirm'];
             if($totalmanoDT == null){
                 $totalmanoDT = 0;
             }
             $manoDA = $this->manoobradirectaA($estructura);
             $totalmanoDA = $manoDA[0]['dirm'];
             if($totalmanoDA == null){
                 $totalmanoDA = 0;
             }
             $manoDS = $this->manoobradirectaS($estructura);
             $totalmanoDS = $manoDS[0]['dirm'];
             if($totalmanoDS == null){
                 $totalmanoDS = 0;
             }
             $manoDO = $this->manoobradirectaO($estructura);
             $totalmanoDO = $manoDO[0]['dirm'];
             if($totalmanoDO == null){
                 $totalmanoDO = 0;
             }
             $totalmanoobradirecta = $totalmanoDO+$totalmanoDS+$totalmanoDA+$totalmanoDT+$totalmanoDE+$totalmanoDD;
//decimo octava
             $manoID = $this->manoobraindirectaD($estructura);
             $totalmanoID = $manoID[0]['dirm'];
             if($totalmanoID==null){
                 $totalmanoID=0;
             }
             $manoIE = $this->manoobraindirectaE($estructura);
             $totalmanoIE = $manoIE[0]['dirm'];
             if($totalmanoIE==null){
                 $totalmanoIE=0;
             }
             $manoIT = $this->manoobraindirectaT($estructura);
             $totalmanoIT = $manoIT[0]['dirm'];
             if($totalmanoIT==null){
                 $totalmanoIT=0;
             }
             $manoIA = $this->manoobraindirectaA($estructura);
             $totalmanoIA = $manoIA[0]['dirm'];
             if($totalmanoIA==null){
                 $totalmanoIA=0;
             }
             $manoIS = $this->manoobraindirectaS($estructura);
             $totalmanoIS = $manoIS[0]['dirm'];
             if($totalmanoIS ==null){
                 $totalmanoIS=0;
             }
             $manoIO = $this->manoobraindirectaO($estructura);
             $totalmanoIO = $manoIO[0]['dirm'];
             if($totalmanoIO ==null){
                 $totalmanoIO=0;
             }
$totalmanoindirecta = $totalmanoIO+$totalmanoIS+$totalmanoIA+$totalmanoIT+$totalmanoIE+$totalmanoID;

             //decimo novena
             $viviendaD = $this->manoobraviviendaD($estructura);
             $totalviviendaD = $viviendaD[0]['dirm'];
             $viviendaE = $this->manoobraviviendaE($estructura);
             $totalviviendaE = $viviendaE[0]['dirm'];
             $viviendaT = $this->manoobraviviendaT($estructura);
             $totalviviendaT = $viviendaT[0]['dirm'];
             $viviendaA = $this->manoobraviviendaA($estructura);
             $totalviviendaA = $viviendaA[0]['dirm'];
             $viviendaS = $this->manoobraviviendaS($estructura);
             $totalviviendaS = $viviendaS[0]['dirm'];
             $viviendaO = $this->manoobraviviendaO($estructura);
             $totalviviendaO = $viviendaO[0]['dirm'];
             $totalvivienda = $totalviviendaO+$totalviviendaS+$totalviviendaA+$totalviviendaT+$totalviviendaE+$totalviviendaD;


             //vigesima
             $turismoD= $this->manoobraturismoD($estructura);
             $totalturismoD = $turismoD[0]['dirm'];
             $turismoE = $this->manoobraturismoE($estructura);
             $totalturismoE = $turismoE[0]['dirm'];
             $turismoT = $this->manoobraturismoT($estructura);
             $totalturismoT = $turismoT[0]['dirm'];
             $turismoA = $this->manoobraturismoA($estructura);
             $totalturismoA = $turismoA[0]['dirm'];
             $turismoS = $this->manoobraturismoS($estructura);
             $totalturismoS = $turismoS[0]['dirm'];
             $turismoO = $this->manoobraturismoO($estructura);
             $totalturismoO = $turismoO[0]['dirm'];
             $totalturismo = $totalturismoO+$totalturismoS+ $totalturismoA+ $totalturismoT+$totalturismoE+$totalturismoD;

 //vigesimo primera
             $otrasD = $this->manoobraotrasD($estructura);
             $totalotrasD = $otrasD[0]['dirm'];
             $otrasE = $this->manoobraotrasE($estructura);
             $totalotrasE = $otrasE[0]['dirm'];
             $otrasT = $this->manoobraotrasT($estructura);
             $totalotrasT = $otrasT[0]['dirm'];
             $otrasA = $this->manoobraotrasA($estructura);
             $totalotrasA = $otrasA[0]['dirm'];
             $otrasS = $this->manoobraotrasA($estructura);
             $totalotrasS=$otrasS[0]['dirm'];
             $otrasO = $this->manoobraotrasO($estructura);
             $totalotrasO = $otrasO[0]['dirm'];
             $totalotras =$totalotrasO+$totalotrasO+$totalotrasA+$totalotrasT+$totalotrasE+$totalotrasD;

//vigesimo segunda
             $adiestradoD = $this->adiestradoD($estructura);
             $totaladiestradoD = $adiestradoD[0]['dirm'];
             $adiestradoE = $this->adiestradoE($estructura);
             $totaladiestradoE = $adiestradoE[0]['dirm'];
             $adiestradoT = $this->adiestradoT($estructura);
             $totaladiestradoT = $adiestradoT[0]['dirm'];
             $adiestradoA = $this->adiestradoA($estructura);
             $totaladiestradoA = $adiestradoA[0]['dirm'];
             $adiestradoS = $this->adiestradoS($estructura);
             $totaladiestradoS = $adiestradoS[0]['dirm'];
             $adiestradoO = $this->adiestradoO($estructura);
             $totaladiestradoO = $adiestradoO[0]['dirm'];
             $totaladiestrado = $totaladiestradoO+$totaladiestradoS+$totaladiestradoA+$totaladiestradoT+$totaladiestradoE+$totaladiestradoD;
             //var_dump($totaladiestradoA);die;
             //
//vigesimo tercera
             $accidenteD = $this->acidenteD($estructura);
             $totalaccidenteD = $accidenteD[0]['dirm'];
             $totalaccidenteD= $totalaccidenteD*8;
             $accidenteE = $this->acidenteE($estructura);
             $totalaccidenteE = $accidenteE[0]['dirm'];
             $totalaccidenteE = $totalaccidenteE*8;
             $accidenteT = $this->acidenteT($estructura);
             $totalaccidenteT = $accidenteT[0]['dirm'];
             $totalaccidenteT = $totalaccidenteT*8;
             $accidenteA = $this->acidenteA($estructura);
             $totalaccidenteA = $accidenteA[0]['dirm'];
             $totalaccidenteA = $totalaccidenteA*8;
             $accidenteS = $this->acidenteS($estructura);
             $totalaccidenteS = $accidenteS [0]['dirm'];
             $totalaccidenteS = $totalaccidenteS*8;
             $accidenteO = $this->acidenteO($estructura);
             $totalaccidenteO = $accidenteO[0]['dirm'];
             $totalaccidenteO = $totalaccidenteO*8;
             $totalaccidente = $totalaccidenteO+$totalaccidenteS+$totalaccidenteA+$totalaccidenteT+$totalaccidenteE+$totalaccidenteD;
//vigesimo cuarta
             $enfermedadD = $this->enfermedadD($estructura);
             $totalenfermedadD = $enfermedadD[0]['dirm'];
             $totalenfermedadD = $totalenfermedadD*8;
             $enfermedadE = $this->enfermedadE($estructura);
             $totalenfermedadE = $enfermedadE[0]['dirm'];
             $totalenfermedadE = $totalenfermedadE*8;
             $enfermedadT = $this->enfermedadT($estructura);
             $totalenfermedadT= $enfermedadT[0]['dirm'];
             $totalenfermedadT = $totalenfermedadT*8;
             $enfermedadA = $this->enfermedadA($estructura);
             $totalenfermedadA = $enfermedadA[0]['dirm'];
             $totalenfermedadA = $totalenfermedadA*8;
             $enfermedadS = $this->enfermedadS($estructura);
             $totalenfermedadS =$enfermedadS[0]['dirm'];
             $totalenfermedadS = $totalenfermedadS*8;
             $enfermedadO = $this->enfermedadO($estructura);
             $totalenfermedadO = $enfermedadO[0]['dirm'];
             $totalenfermedadO = $totalenfermedadO*8;
             $totalenfermedad = $totalenfermedadO+$totalenfermedadS+$totalenfermedadA+$totalenfermedadT+$totalenfermedadE+$totalenfermedadD;
//vigesimo quinta
             $licenciaSSD = $this->licenciaSSD($estructura);
             $totallicenciaSSD = $licenciaSSD[0]['dirm'];
             $totallicenciaSSD = $totallicenciaSSD*8;
             $licenciaSSE = $this->licenciaSSE($estructura);
             $totallicenciaSSE = $licenciaSSE[0]['dirm'];
             $totallicenciaSSE = $totallicenciaSSE*8;
             $licenciaSST = $this->licenciaSST($estructura);
             $totallicenciaSST = $licenciaSST[0]['dirm'];
             $totallicenciaSST = $totallicenciaSST*8;
             $licenciaSSA = $this->licenciaSSA($estructura);
             $totallicenciaSSA = $licenciaSSA[0]['dirm'];
             $totallicenciaSSA = $totallicenciaSSA*8;
             $licenciaSSS = $this->licenciaSSS($estructura);
             $totallicenciaSSS = $licenciaSSS[0]['dirm'];
             $totallicenciaSSS =$totallicenciaSSS*8;
             $licenciaSSO = $this->licenciaSSO($estructura);
             $totallicenciaSSO = $licenciaSSO[0]['dirm'];
             $totallicenciaSSO=$totallicenciaSSO*8;
             $totallicenciaSS = $totallicenciaSSO+$totallicenciaSSS+$totallicenciaSSA+$totallicenciaSST+$totallicenciaSSE+$totallicenciaSSD;
//vigesimo sexta
             $obligacionesD = $this->obligacionesD($estructura);
             $totalobligacionesD = $obligacionesD[0]['dirm'];
             $totalobligacionesD = $totalobligacionesD*8;
             $obligacionesE = $this->obligacionesE($estructura);
             $totalobligacionesE = $obligacionesE[0]['dirm'];
             $totalobligacionesE = $totalobligacionesE*8;
             $obligacionesT = $this->obligacionesT($estructura);
             $totalobligacionesT = $obligacionesT[0]['dirm'];
             $totalobligacionesT = $totalobligacionesT*8;
             $obligacionesA = $this->obligacionesA($estructura);
             $totalobligacionesA = $obligacionesA[0]['dirm'];
             $totalobligacionesA =$totalobligacionesA*8;
             $obligacionesS = $this->obligacionesS($estructura);
             $totalobligacionesS = $obligacionesS[0]['dirm'];
             $totalobligacionesS = $totalobligacionesS*8;
             $obligacionesO = $this->obligacionesO($estructura);
             $totalobligacionesO = $obligacionesO[0]['dirm'];
             $totalobligacionesO = $totalobligacionesO*8;
             $totalobligaciones = $totalobligacionesO+$totalobligacionesS+$totalobligacionesA+$totalobligacionesT+$totalobligacionesE+$totalobligacionesD;

//vigesimo septima
             $autorizadosD = $this->autorizadosD($estructura);
             $totalautorizadosD = $autorizadosD[0]['dirm'];
             $totalautorizadosD = $totalautorizadosD*8;
             $autorizadosE = $this->autorizadosE($estructura);
             $totalautorizadosE = $autorizadosE[0]['dirm'];
             $totalautorizadosE = $totalautorizadosE*8;
             $autorizadosT = $this->autorizadosT($estructura);
             $totalautorizadosT = $autorizadosT[0]['dirm'];
             $totalautorizadosT = $totalautorizadosT *8;
             $autorizadosA = $this->autorizadosA($estructura);
             $totalautorizadosA = $autorizadosA[0]['dirm'];
             $totalautorizadosA = $totalautorizadosA*8;
             $autorizadosS = $this->autorizadosS($estructura);
             $totalautorizadosS = $autorizadosS[0]['dirm'];
             $totalautorizadosS = $totalautorizadosS*8;
             $autorizadosO = $this->autorizadosO($estructura);
             $totalautorizadosO = $autorizadosO[0]['dirm'];
             $totalautorizadosO = $totalautorizadosO*8;
             $totalautorizados = $totalautorizadosO+$totalautorizadosS+$totalautorizadosA+$totalautorizadosT+$totalautorizadosE+$totalautorizadosD;
//vigesimo octava
             $injustD = $this->injustificadosD($estructura);
             $totalinjustD = $injustD[0]['dirm'];
             $totalinjustD = $totalinjustD*8;
             $injustE = $this->injustificadosE($estructura);
             $totalinjustE = $injustE[0]['dirm'];
             $totalinjustE = $totalinjustE *8;
             $injustT = $this->injustificadosT($estructura);
             $totalinjustT = $injustT[0]['dirm'];
             $totalinjustT = $totalinjustT*8;
             $injustA = $this->injustificadosA($estructura);
             $totalinjustA = $injustA[0]['dirm'];
             $totalinjustA = $totalinjustA*8;
             $injustS = $this->injustificadosS($estructura);
             $totalinjustS = $injustS[0]['dirm'];
             $totalinjustS = $totalinjustS*8;
             $injustO = $this->injustificadosO($estructura);
             $totalinjustO = $injustO[0]['dirm'];
             $totalinjustO = $totalinjustO*8;
             $totalinjust = $totalinjustO+$totalinjustS+$totalinjustA+$totalinjustT+$totalinjustE+$totalinjustD;


//plantilla
             $plantillageneralD = $this->plantillageneralD($estructura);
             $generalD = $plantillageneralD[0]['cargo'];
             $plantillageneralE = $this->plantillageneralE($estructura);
             $generalE = $plantillageneralE[0]['cargo'];
             $plantillageneralA = $this->plantillageneralA($estructura);
             $generalA = $plantillageneralA[0]['cargo'];
             $plantillageneralS = $this->plantillageneralS($estructura);
             $generalS = $plantillageneralS[0]['cargo'];
             $plantillageneralT = $this->plantillageneralT($estructura);
             $generalT = $plantillageneralT[0]['cargo'];
             $plantillageneralO = $this->plantillageneralO($estructura);
             $generalO = $plantillageneralO[0]['cargo'];



             //Cabecera
         $pdf->SetFont('Arial', 'B', 15);
         $pdf->SetMargins(50,10);
$d = utf8_decode($deno);
             $categoria = utf8_decode('Categoría');
         //Primera fila del encabezado
             $pdf->SetX(100);
             $pdf->Cell(400,15,"$d",0,0, 'C');
             $pdf->Ln(15);
             $pdf->Cell(200,15,"Compisicion y movimiento de la Fuerza de trabajo",0,0, 'C');
             $pdf->Cell(200,15,"$categoria ocupacional",0,0,'C');
             $pdf->Ln(15);
         $pdf->SetX(20);
         $pdf->Cell(10,15,"No",1,0, 'T');
         $pdf->Cell(70,15,"Conceptos",1,0);
         $pdf->Cell(20, 15, "U.M",1,0, 'T');
         $pdf->Cell(50, 15, "Directivo",1,0, 'T');
         $pdf->Cell(50, 15, "Ejecutivo",1,0, 'T');
         $pdf->Cell(50, 15, "$tec",1,0, 'T');
         $pdf->Cell(50, 15, "Administrativo",1,0, 'T');
         $pdf->Cell(50, 15, "Servicio",1,0, 'T');
         $pdf->Cell(50, 15, "Operario",1,0, 'T');
         $pdf->Cell(50, 15, "Total",1,0, 'T');
         $pdf->Ln(15);
         //Segunda fila
             $pdf->SetX(20);
         $pdf->Cell(10, 15, "1",1,0, 'C');
         $pdf->Cell(70, 15, "Nivel Superior",1,0, 'C');
         $pdf->Cell(20, 15, "Uno",1,0, 'C');
         $pdf->Cell(50,15, "$totalNSdirectivo",1,0, 'C');
         $pdf->Cell(50,15,"$totalNSejecutivo",1,0, 'C');
         $pdf->Cell(50,15,"$totalNStecnico",1,0, 'C');
         $pdf->Cell(50,15,"$totalNSadministrativo",1,0, 'C');
         $pdf->Cell(50,15,"$totalNSservicio",1,0, 'C');
         $pdf->Cell(50,15,"$totalNSoperario",1,0, 'C');
         $pdf->Cell(50,15,"$totalNS",1,0, 'C');


         $pdf->Ln(15);
         //tercera fila
             $pdf->SetX(20);
         $pdf->Cell(10, 15, "2",1,0, 'C');
         $pdf->Cell(70, 15, "Nivel Medio",1,0, 'C');
         $pdf->Cell(20, 15, "Uno",1,0, 'C');
         $pdf->Cell(50, 15, "$totalNMdirectivo",1,0, 'C');
         $pdf->Cell(50, 15, "$totalNMejecutivo",1,0,'C');
         $pdf->Cell(50, 15, "$totalNMtecnico",1,0, 'C');
         $pdf->Cell(50, 15, "$totalNMadministrativo",1,0, 'C');
         $pdf->Cell(50, 15, "$totalNMservicio",1,0, 'C');
         $pdf->Cell(50, 15, "$totalNMoperario",1,0, 'C');
         $pdf->Cell(50, 15, "$totalNM",1,0, 'C');
         $pdf->Ln(15);
         //cuarta fila
             $pdf->SetX(20);
         $pdf->Cell(10, 15, "3",1,0, 'C');
         $pdf->Cell(70, 15, "Obrero Calificado",1,0,'C');
         $pdf->Cell(20, 15, "Uno",1,0, 'C');
         $pdf->Cell(50, 15, "$totalOCdirectivo",1,0, 'C');
         $pdf->Cell(50, 15, "$totalOCejecutivo",1,0,'C');
         $pdf->Cell(50, 15, "$totalOCtecnico",1,0, 'C');
         $pdf->Cell(50, 15, "$totalOCadministrativo",1,0, 'C');
         $pdf->Cell(50, 15, "$totalOCservicio",1,0, 'C');
         $pdf->Cell(50, 15, "$totalOCoperario",1,0, 'C');
         $pdf->Cell(50, 15, "$totalobrero",1,0, 'C');

         $pdf->Ln(15);
         //quinta fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "4",1,0, 'C');
             $pdf->Cell(70, 15, "Sin Clasificacion",1,0, 'C');
             $pdf->Cell(20, 15, "Uno",1,0, 'C');
             $pdf->Cell(50, 15, "$totalSCdirectivo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalejecutivo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalSCtecnico",1,0, 'C');
             $pdf->Cell(50, 15, "$totalSCadministrativo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalSCservicio",1,0, 'C');
             $pdf->Cell(50, 15, "$totalSCoperario",1,0, 'C');
             $pdf->Cell(50, 15, "$totalSC",1,0, 'C');
             $pdf->Ln(15);

             //septa fila
             $pdf->SetX(20);
             //$pdf->SetDrawColor(200,200,200);
             $pdf->Cell(10, 15, "5",1,0, 'C');
             $pdf->Cell(70, 15, "Total",1,0, 'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totaldirectivo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalejecutivo",1,0, 'C');
             $pdf->Cell(50, 15, "$totaltecnico",1,0, 'C');
             $pdf->Cell(50, 15, "$totaladministrativo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalservicio",1,0, 'C');
             $pdf->Cell(50, 15, "$totaloperario",1,0, 'C');
             $pdf->Cell(50, 15, "$totalgeneral",1,0, 'C');
             $pdf->Ln(15);


         //Segunda reporte
             //primera fila
             $general = $generalD+$generalE+$generalT+$generalA+$generalS+$generalO;
          $pdf->SetX(20);
          $pdf->Cell(10, 15, "5.1",1,0, 'C');
          $pdf->Cell(70,15,"Plantilla Aprobada",1,0,'C');
          $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$generalD",1,0, 'C');
             $pdf->Cell(50, 15, "$generalE",1,0, 'C');
             $pdf->Cell(50, 15, "$generalT",1,0, 'C');
             $pdf->Cell(50, 15, "$generalA",1,0, 'C');
             $pdf->Cell(50, 15, "$generalS",1,0, 'C');
             $pdf->Cell(50, 15, "$generalO",1,0, 'C');
             $pdf->Cell(50, 15, "$general",1,0, 'C');
             $pdf->Ln(15);

             //segunda fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "5.2",1,0, 'C');
             $pdf->Cell(70,15,"Plantilla Cubierta",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalpd",1,0, 'C');
             $pdf->Cell(50, 15, "$totalpe",1,0, 'C');
             $pdf->Cell(50, 15, "$totalpt",1,0, 'C');
             $pdf->Cell(50, 15, "$totalpa",1,0, 'C');
             $pdf->Cell(50, 15, "$totalps",1,0, 'C');
             $pdf->Cell(50, 15, "$totalpo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalplantillaprobada",1,0, 'C');
             $pdf->Ln(15);

             //tercera fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "5.3",1,0, 'C');
             $pdf->Cell(70,15,"Mujeres",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalmd",1,0, 'C');
             $pdf->Cell(50, 15, "$totalme",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmt",1,0, 'C');
             $pdf->Cell(50, 15, "$totalma",1,0, 'C');
             $pdf->Cell(50, 15, "$totalms",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmujeres",1,0, 'C');
             $pdf->Ln(15);

             //tercer reporte
             //primera fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "6",1,0, 'C');
             $pdf->Cell(70,15,"Bajas",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalbajasdirectivo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbajasejecutivo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbajastecnico",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbajasadministrativo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbajasservicio",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbajasoperario",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbajas",1,0, 'C');
             $pdf->Ln(15);

             //segunda fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "6.1",1,0, 'C');
             $pdf->Cell(70,15,"Solicitud Propia",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalbspd",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbspe",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbspt",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbspa",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbsps",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbspo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbajassolicitudpropia",1,0, 'C');
             $pdf->Ln(15);

             //tercera fila
             $san = utf8_decode('Sanción');
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "6.2",1,0, 'C');
             $pdf->Cell(70,15,"$san laboral y judic",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalbsljd",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbslje",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbsljt",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbslja",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbsljs",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbsljo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbajassancion",1,0, 'C');
             $pdf->Ln(15);

             //cuarta fila
             $jub = utf8_decode('Jubilación');
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "6.3",1,0, 'C');
             $pdf->Cell(70,15,"$jub y/o fallecimiento",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalbjfd",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbjfe",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbjft",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbjfa",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbjfs",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbjfo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbajasJF",1,0, 'C');
             $pdf->Ln(15);

             //quinta fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "6.4",1,0, 'C');
             $pdf->Cell(70,15,"Movimiento interno",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalmovD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmovE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmovT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmovA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmovS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmovO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmovimiento",1,0, 'C');
             $pdf->Ln(15);

//sexta fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "6.5",1,0, 'C');
             $pdf->Cell(70,15,"Otras bajas",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalbod",1,0, 'C');
             $pdf->Cell(50, 15, "$totalboe",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbot",1,0, 'C');
             $pdf->Cell(50, 15, "$totalboa",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbos",1,0, 'C');
             $pdf->Cell(50, 15, "$totalboo",1,0, 'C');
             $pdf->Cell(50, 15, "$totalbajasotras",1,0, 'C');
             $pdf->Ln(15);

             //cuarto reporte
             //primera fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "7",1,0, 'C');
             $pdf->Cell(70,15,"Altas",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalaltasdirectivos",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasejecutivos",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltastecnicos",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasadministrativos",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasservicio",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasoperario",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltas",1,0, 'C');
             $pdf->Ln(15);
//segunda fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "7.1",1,0, 'C');
             $pdf->Cell(70,15,"Dentro del organismo",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalAltaDED",1,0, 'C');
             $pdf->Cell(50, 15, "$totalAltaDEE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalAltaDET",1,0, 'C');
             $pdf->Cell(50, 15, "$totalAltaDEA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalAltaDES",1,0, 'C');
             $pdf->Cell(50, 15, "$totalAltaDEO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasdentroentidad",1,0, 'C');
             $pdf->Ln(15);

             //tercera fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "7.2",1,0, 'C');
             $pdf->Cell(70,15,"Fuera del organismo",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalaltasfD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasfE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasfT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasfA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasfS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasfO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaltasdentroorganismo",1,0, 'C');
             $pdf->Ln(15);

             //quinto reporte
             //primera fila
             //calculo de totales
             $totalmanodirectos = $totalmanoDD+$totalmanoID;
             $totalmanoejecutivos = $totalmanoDE+$totalmanoIE;
             $totalmanotecnicos = $totalmanoDT+$totalmanoIT;
             $totalmanoadministrativos = $totalmanoDA+$totalmanoIA;
             $totalmanoservicio = $totalmanoDS+ $totalmanoIS;
             $totalmanooperario = $totalmanoDO+$totalmanoIO;
             $promediodetrabajadores = $totalmanodirectos+$totalmanotecnicos+$totalmanoejecutivos+$totalmanoadministrativos+$totalmanoservicio+$totalmanooperario;
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "8",1,0, 'C');
             $pdf->Cell(70,15,"Promedio de trabajad",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalmanodirectos",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoejecutivos",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanotecnicos",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoadministrativos",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoservicio",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanooperario",1,0, 'C');
             $pdf->Cell(50, 15, "$promediodetrabajadores",1,0, 'C');
             $pdf->Ln(15);

             //segunda fila

             $pdf->SetX(20);
             $pdf->Cell(10, 15, "8.1",1,0, 'C');
             $pdf->Cell(70,15,"Mano de obra directa",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalmanoDD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoDE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoDT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoDA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoDS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoDO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoobradirecta",1,0, 'C');
             $pdf->Ln(15);

             //tercera fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "8.2",1,0, 'C');
             $pdf->Cell(70,15,"Mano de obra indirecta",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalmanoID",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoIE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoIT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoIA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoIS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoIO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalmanoindirecta",1,0, 'C');
             $pdf->Ln(15);

             //cuarta fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "8.3",1,0, 'C');
             $pdf->Cell(70,15,"Mano en vivienda",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalviviendaD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalviviendaE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalviviendaT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalviviendaA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalviviendaS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalviviendaO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalvivienda",1,0, 'C');
             $pdf->Ln(15);

             //quinta
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "8.4",1,0, 'C');
             $pdf->Cell(70,15,"Mano en turismo",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalturismoD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalturismoE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalturismoT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalturismoA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalturismoS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalturismoO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalturismo",1,0, 'C');
             $pdf->Ln(15);

             //sexta fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "8.5",1,0, 'C');
             $pdf->Cell(70,15,"Mano en otras",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totalotrasD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalotrasE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalotrasT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalotrasA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalotrasS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalotrasO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalotras",1,0, 'C');
             $pdf->Ln(15);

             //septima fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "8.6",1,0, 'C');
             $pdf->Cell(70,15,"Adiestrado",1,0,'C');
             $pdf->Cell(20, 15, "Uno",1,0,'C');
             $pdf->Cell(50, 15, "$totaladiestradoD",1,0, 'C');
             $pdf->Cell(50, 15, "$totaladiestradoE",1,0, 'C');
             $pdf->Cell(50, 15, "$totaladiestradoT",1,0, 'C');
             $pdf->Cell(50, 15, "$totaladiestradoA",1,0, 'C');
             $pdf->Cell(50, 15, "$totaladiestradoS",1,0, 'C');
             $pdf->Cell(50, 15, "$totaladiestradoO",1,0, 'C');
             $pdf->Cell(50, 15, "$totaladiestrado",1,0, 'C');
             $pdf->Ln(15);

             //sexto reporte
             //primera fila
             $totalFTD = $totalaccidenteD+$totalenfermedadD+$totalobligacionesD+$totalinjustD+$totalautorizadosD;
             $totalFTE =  $totalaccidenteE+$totalenfermedadE+$totalobligacionesE+$totalinjustE+$totalautorizadosE;
             $totalFTT = $totalaccidenteT+$totalenfermedadT+$totalobligacionesT+$totalinjustT+$totalautorizadosT;
             $totalFTA = $totalaccidenteA+$totalenfermedadA+$totalobligacionesA+$totalinjustA+$totalautorizadosA;
             $totalFTS = $totalaccidenteS+$totalenfermedadS+$totalobligacionesS+$totalinjustS+$totalautorizadosS;
             $totalFTO = $totalaccidenteO+$totalenfermedadO+$totalobligacionesO+$totalinjustO+$totalautorizadosO;
             $totalFT = $totalFTO+$totalFTS+$totalFTA+$totalFTT+$totalFTE+$totalFTD;
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "9",1,0, 'C');
             $pdf->Cell(70,15,"F.T. No trabajado",1,0,'C');
             $pdf->Cell(20, 15, "H/D",1,0,'C');
             $pdf->Cell(50, 15, "$totalFTD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalFTE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalFTT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalFTA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalFTS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalFTO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalFT",1,0, 'C');
             $pdf->Ln(15);

             //segunda fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "9.1",1,0, 'C');
             $pdf->Cell(70,15,"Accidente de trabajo",1,0,'C');
             $pdf->Cell(20, 15, "H/D",1,0,'C');
             $pdf->Cell(50, 15, "$totalaccidenteD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaccidenteE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaccidenteT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaccidenteA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaccidenteS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaccidenteO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalaccidente",1,0, 'C');
             $pdf->Ln(15);

             //tercera fila
             $enf = utf8_decode('común');
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "9.2",1,0, 'C');
             $pdf->Cell(70,15,"Enfermedad $enf",1,0,'C');
             $pdf->Cell(20, 15, "H/D",1,0,'C');
             $pdf->Cell(50, 15, "$totalenfermedadD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalenfermedadE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalenfermedadT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalenfermedadA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalenfermedadS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalenfermedadO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalenfermedad",1,0, 'C');
             $pdf->Ln(15);

             //cuarta fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "9.3",1,0, 'C');
             $pdf->Cell(70,15,"Licencia de maternidad",1,0,'C');
             $pdf->Cell(20, 15, "H/D",1,0,'C');
             $pdf->Cell(50, 15, "",1,0, 'C');
             $pdf->Cell(50, 15, "",1,0, 'C');
             $pdf->Cell(50, 15, "",1,0, 'C');
             $pdf->Cell(50, 15, "",1,0, 'C');
             $pdf->Cell(50, 15, "",1,0, 'C');
             $pdf->Cell(50, 15, "",1,0, 'C');
             $pdf->Cell(50, 15, "",1,0, 'C');
             $pdf->Ln(15);
             //quinta fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "9.4",1,0, 'C');
             $pdf->Cell(70,15,"Licencia sin sueldo",1,0,'C');
             $pdf->Cell(20, 15, "H/D",1,0,'C');
             $pdf->Cell(50, 15, "$totallicenciaSSD",1,0, 'C');
             $pdf->Cell(50, 15, "$totallicenciaSSE",1,0, 'C');
             $pdf->Cell(50, 15, "$totallicenciaSST",1,0, 'C');
             $pdf->Cell(50, 15, "$totallicenciaSSA",1,0, 'C');
             $pdf->Cell(50, 15, "$totallicenciaSSS",1,0, 'C');
             $pdf->Cell(50, 15, "$totallicenciaSSO",1,0, 'C');
             $pdf->Cell(50, 15, "$totallicenciaSS",1,0, 'C');
             $pdf->Ln(15);
             //sexta fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "9.5",1,0, 'C');
             $pdf->Cell(70,15,"Obligaciones Estat. y Soc.",1,0,'C');
             $pdf->Cell(20, 15, "H/D",1,0,'C');
             $pdf->Cell(50, 15, "$totalobligacionesD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalobligacionesE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalobligacionesT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalobligacionesA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalobligacionesS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalobligacionesO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalobligaciones",1,0, 'C');
             $pdf->Ln(15);
             //septima fila
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "9.6",1,0, 'C');
             $pdf->Cell(70,15,"Ausencias Autorizadas",1,0,'C');
             $pdf->Cell(20, 15, "H/D",1,0,'C');
             $pdf->Cell(50, 15, "$totalautorizadosD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalautorizadosE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalautorizadosT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalautorizadosA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalautorizadosS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalautorizadosO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalautorizados",1,0, 'C');
             $pdf->Ln(15);
             //octava fila




             $pdf->SetX(20);
             $pdf->Cell(10, 15, "9.7",1,0, 'C');
             $pdf->Cell(70,15,"Ausencias Injustificadas",1,0,'C');
             $pdf->Cell(20, 15, "H/D",1,0,'C');
             $pdf->Cell(50, 15, "$totalinjustD",1,0, 'C');
             $pdf->Cell(50, 15, "$totalinjustE",1,0, 'C');
             $pdf->Cell(50, 15, "$totalinjustT",1,0, 'C');
             $pdf->Cell(50, 15, "$totalinjustA",1,0, 'C');
             $pdf->Cell(50, 15, "$totalinjustS",1,0, 'C');
             $pdf->Cell(50, 15, "$totalinjustO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalinjust",1,0, 'C');
             $pdf->Ln(15);
             //reporte 7
             $FMTD =   $totaldirectivo *(190.6);
             $FMTE =  $totalejecutivo *(190.6);
             $FMTT =  $totaltecnico*(190.6);
             $FMTA= $totaladministrativo *(190.6);
             $FMTS =  $totalservicio*(190.6);
             $FMTO = $totaloperario*(190.6);
             $FMTG = $totalgeneral*(190.6);
             // var_dump($FMTG);die;

             //total de horas trabajadas
             $horastrabajadasD = $FMTD-$totalFTD;
             $horastrabajadasE = $FMTE-$totalFTE;
             $horastrabajadasT = $FMTT-$totalFTT;
             $horastrabajadasA = $FMTA-$totalFTA;
             $horastrabajadasS = $FMTS-$totalFTS;
             $horastrabajadasO = $FMTO-$totalFTO;
             $totalhorastrabajadas = $horastrabajadasD+$horastrabajadasE+$horastrabajadasT+$horastrabajadasA+$horastrabajadasS+$horastrabajadasO;
             $pdf->SetX(20);
             $pdf->Cell(10, 15, "10",1,0, 'C');
             $pdf->Cell(70,15,"Horas trabajadas",1,0,'C');
             $pdf->Cell(20, 15, "H/h",1,0,'C');
             $pdf->Cell(50, 15, "$horastrabajadasD",1,0, 'C');
             $pdf->Cell(50, 15, "$horastrabajadasE",1,0, 'C');
             $pdf->Cell(50, 15, "$horastrabajadasT",1,0, 'C');
             $pdf->Cell(50, 15, "$horastrabajadasA",1,0, 'C');
             $pdf->Cell(50, 15, "$horastrabajadasS",1,0, 'C');
             $pdf->Cell(50, 15, "$horastrabajadasO",1,0, 'C');
             $pdf->Cell(50, 15, "$totalhorastrabajadas",1,0, 'C');
             $pdf->Ln(15);
             //reporte 8



             $pdf->SetX(20);
             $pdf->Cell(10, 15, "11",1,0, 'C');
             $pdf->Cell(70,15,"FTMU",1,0,'C');
             $pdf->Cell(20, 15, "H/D",1,0,'C');
             $pdf->Cell(50, 15, "$FMTD",1,0, 'C');
             $pdf->Cell(50, 15, "$FMTE",1,0, 'C');
             $pdf->Cell(50, 15, "$FMTT",1,0, 'C');
             $pdf->Cell(50, 15, "$FMTA",1,0, 'C');
             $pdf->Cell(50, 15, "$FMTS",1,0, 'C');
             $pdf->Cell(50, 15, "$FMTO",1,0, 'C');
             $pdf->Cell(50, 15, "$FMTG",1,0, 'C');
             $pdf->Ln(15);
             //reporte 9
             $porcientoD = ($totalFTD/$FMTD)*100;
             $porcientoE = ($totalFTE/$FMTE)*100;
             $porcientoT = ($totalFTT/$FMTT)*100;
             $porcientoA = ($totalFTA/$FMTA)*100;
             $porcientoS = ($totalFTS/$FMTS)*100;
             $porcientoO = ($totalFTO/$FMTO)*100;
             $porcientototal = ($totalFT/$FMTG)*100;


             $porcientoT=   round($porcientoT, 2, PHP_ROUND_HALF_UP);
             $porcientoD=   round($porcientoD, 2, PHP_ROUND_HALF_UP);
             $porcientoE=   round($porcientoE, 2, PHP_ROUND_HALF_UP);
             $porcientoA=   round($porcientoA, 2, PHP_ROUND_HALF_UP);
             $porcientoS=   round($porcientoS, 2, PHP_ROUND_HALF_UP);
             $porcientoO=   round($porcientoO, 2, PHP_ROUND_HALF_UP);
             $porcientototal=   round($porcientototal, 2, PHP_ROUND_HALF_UP);
             $pdf->SetX(20);

             $pdf->Cell(10, 15, "12",1,0, 'C');
             $pdf->Cell(70,15,"Porciento de Ausencias",1,0,'C');
             $pdf->Cell(20, 15, "%",1,0,'C');
             $pdf->Cell(50, 15, "$porcientoD",1,0, 'C');
             $pdf->Cell(50, 15, "$porcientoE",1,0, 'C');
             $pdf->Cell(50, 15, "$porcientoT",1,0, 'C');
             $pdf->Cell(50, 15, "$porcientoA",1,0, 'C');
             $pdf->Cell(50, 15, "$porcientoS",1,0, 'C');
             $pdf->Cell(50, 15, "$porcientoO",1,0, 'C');
             $pdf->Cell(50, 15, "$porcientototal",1,0, 'C');
             $pdf->Ln(50);


             //pie de firma
             $pdf->SetX(20);
             $pdf->Cell(50, 15, "Elaborado:",0,0, 'C');
             $pdf->SetX(250);
             $pdf->Cell(50, 15, "Aprobado por:",0,0, 'C');
         return $pdf;
     }
    public function cabeceraReporte2($pdf,   $estructura)
    {
                //Cabecera
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->SetMargins(50,10);
$categoria = utf8_decode('Categoría');
        $tec = utf8_decode('Técnico');
        //Primera fila del encabezado
        $pdf->SetX(100);
        $pdf->Cell(400,15,"",0,0, 'C');
        $pdf->Ln(15);
        $pdf->Cell(200,15,"Compisicion y movimiento de la Fuerza de trabajo",0,0, 'C');
        $pdf->Cell(200,15,"$categoria ocupacional",0,0,'C');
        $pdf->Ln(15);
        $pdf->SetX(20);
        $pdf->Cell(10,15,"No",1,0, 'T');
        $pdf->Cell(70,15,"Conceptos",1,0);
        $pdf->Cell(20, 15, "U.M",1,0, 'T');
        $pdf->Cell(50, 15, "Directivo",1,0, 'T');
        $pdf->Cell(50, 15, "Ejecutivo",1,0, 'T');
        $pdf->Cell(50, 15, "$tec",1,0, 'T');
        $pdf->Cell(50, 15, "Administrativo",1,0, 'T');
        $pdf->Cell(50, 15, "Servicio",1,0, 'T');
        $pdf->Cell(50, 15, "Operario",1,0, 'T');
        $pdf->Cell(50, 15, "Total",1,0, 'T');
        $pdf->Ln(15);
        //Segunda fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "1",1,0, 'C');
        $pdf->Cell(70, 15, "Nivel Superior",1,0, 'C');
        $pdf->Cell(20, 15, "Uno",1,0, 'C');
        $pdf->Cell(50,15, "",1,0, 'C');
        $pdf->Cell(50,15,"",1,0, 'C');
        $pdf->Cell(50,15,"",1,0, 'C');
        $pdf->Cell(50,15,"",1,0, 'C');
        $pdf->Cell(50,15,"",1,0, 'C');
        $pdf->Cell(50,15,"",1,0, 'C');
        $pdf->Cell(50,15,"",1,0, 'C');


        $pdf->Ln(15);
        //tercera fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "2",1,0, 'C');
        $pdf->Cell(70, 15, "Nivel Medio",1,0, 'C');
        $pdf->Cell(20, 15, "Uno",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);
        //cuarta fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "3",1,0, 'C');
        $pdf->Cell(70, 15, "Obrero Calificado",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');

        $pdf->Ln(15);
        //quinta fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "4",1,0, 'C');
        $pdf->Cell(70, 15, "Sin Clasificacion",1,0, 'C');
        $pdf->Cell(20, 15, "Uno",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //septa fila
        $pdf->SetX(20);
        //$pdf->SetDrawColor(200,200,200);
        $pdf->Cell(10, 15, "5",1,0, 'C');
        $pdf->Cell(70, 15, "Total",1,0, 'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);


        //Segunda reporte
        //primera fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "5.1",1,0, 'C');
        $pdf->Cell(70,15,"Plantilla Aprobada",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //segunda fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "5.2",1,0, 'C');
        $pdf->Cell(70,15,"Plantilla Cubierta",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //tercera fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "5.3",1,0, 'C');
        $pdf->Cell(70,15,"Mujeres",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //tercer reporte
        //primera fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "6",1,0, 'C');
        $pdf->Cell(70,15,"Bajas",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //segunda fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "6.1",1,0, 'C');
        $pdf->Cell(70,15,"Solicitud Propia",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //tercera fila
        $san = utf8_decode('Sanción');
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "6.2",1,0, 'C');
        $pdf->Cell(70,15,"$san laboral y judic",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //cuarta fila
        $jub = utf8_decode('Jubilación');
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "6.3",1,0, 'C');
        $pdf->Cell(70,15,"$jub y/o fallecimiento",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //quinta fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "6.4",1,0, 'C');
        $pdf->Cell(70,15,"Movimiento interno",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

//sexta fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "6.5",1,0, 'C');
        $pdf->Cell(70,15,"Otras bajas",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //cuarto reporte
        //primera fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "7",1,0, 'C');
        $pdf->Cell(70,15,"Altas",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);
//segunda fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "7.1",1,0, 'C');
        $pdf->Cell(70,15,"Dentro del organismo",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //tercera fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "7.2",1,0, 'C');
        $pdf->Cell(70,15,"Fuera del organismo",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);


        $pdf->SetX(20);
        $pdf->Cell(10, 15, "8",1,0, 'C');
        $pdf->Cell(70,15,"Promedio de trabajad",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //segunda fila

        $pdf->SetX(20);
        $pdf->Cell(10, 15, "8.1",1,0, 'C');
        $pdf->Cell(70,15,"Mano de obra directa",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //tercera fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "8.2",1,0, 'C');
        $pdf->Cell(70,15,"Mano de obra indirecta",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //cuarta fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "8.3",1,0, 'C');
        $pdf->Cell(70,15,"Mano en vivienda",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //quinta
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "8.4",1,0, 'C');
        $pdf->Cell(70,15,"Mano en turismo",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //sexta fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "8.5",1,0, 'C');
        $pdf->Cell(70,15,"Mano en otras",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //septima fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "8.6",1,0, 'C');
        $pdf->Cell(70,15,"Adiestrado",1,0,'C');
        $pdf->Cell(20, 15, "Uno",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);


        $pdf->SetX(20);
        $pdf->Cell(10, 15, "9",1,0, 'C');
        $pdf->Cell(70,15,"F.T. No trabajado",1,0,'C');
        $pdf->Cell(20, 15, "H/D",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //segunda fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "9.1",1,0, 'C');
        $pdf->Cell(70,15,"Accidente de trabajo",1,0,'C');
        $pdf->Cell(20, 15, "H/D",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //tercera fila
        $enf = utf8_decode('común');
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "9.2",1,0, 'C');
        $pdf->Cell(70,15,"Enfermedad $enf",1,0,'C');
        $pdf->Cell(20, 15, "H/D",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        //cuarta fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "9.3",1,0, 'C');
        $pdf->Cell(70,15,"Licencia de maternidad",1,0,'C');
        $pdf->Cell(20, 15, "H/D",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);
        //quinta fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "9.4",1,0, 'C');
        $pdf->Cell(70,15,"Licencia sin sueldo",1,0,'C');
        $pdf->Cell(20, 15, "H/D",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);
        //sexta fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "9.5",1,0, 'C');
        $pdf->Cell(70,15,"Obligaciones Estat. y Soc.",1,0,'C');
        $pdf->Cell(20, 15, "H/D",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);
        //septima fila
        $pdf->SetX(20);
        $pdf->Cell(10, 15, "9.6",1,0, 'C');
        $pdf->Cell(70,15,"Ausencias Autorizadas",1,0,'C');
        $pdf->Cell(20, 15, "H/D",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);
        //octava fila




        $pdf->SetX(20);
        $pdf->Cell(10, 15, "9.7",1,0, 'C');
        $pdf->Cell(70,15,"Ausencias Injustificadas",1,0,'C');
        $pdf->Cell(20, 15, "H/D",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        $pdf->SetX(20);
        $pdf->Cell(10, 15, "10",1,0, 'C');
        $pdf->Cell(70,15,"Horas trabajadas",1,0,'C');
        $pdf->Cell(20, 15, "H/h",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);
        //reporte 8



        $pdf->SetX(20);
        $pdf->Cell(10, 15, "11",1,0, 'C');
        $pdf->Cell(70,15,"FTMU",1,0,'C');
        $pdf->Cell(20, 15, "H/D",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(15);

        $pdf->SetX(20);

        $pdf->Cell(10, 15, "12",1,0, 'C');
        $pdf->Cell(70,15,"Porciento de Ausencias",1,0,'C');
        $pdf->Cell(20, 15, "%",1,0,'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Cell(50, 15, "",1,0, 'C');
        $pdf->Ln(50);


        //pie de firma
        $pdf->SetX(20);
        $pdf->Cell(50, 15, "Elaborado:",0,0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(50, 15, "Aprobado por:",0,0, 'C');
        return $pdf;}
}