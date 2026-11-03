<?php
/**
 * Class PersonaSOAPService
 * Implementa brinda los servicios para el sistema OSIM
 *
 * @author Javier Rodriguez Lopez
 */
class PersonaSOAPService
{

    /**
     * Los tipos de medios de contacto
     *
     * @param $limit
     * @param $start
     * @param $denom
     *
     * @return array Lista de tipo de medios de contacto
     */
    public function getTipoMedioContacto($limit = 20, $start = 0, $denom)
    {
        $obj = new NomTipoMedioContacto();
        return $obj->GetPorLimite($limit, $start, $denom);
    }

    public function getPersonsByMedioContacto($limit = 20, $start = 0, $arrUsers = array(), $idtipomediocontacto = 0, $filter = null)
    {
        $obj = new OsimModel();
        return $obj->getPersonsByMedioContacto($limit, $start, $arrUsers, $idtipomediocontacto, $filter);
    }

    /**
     * Listado paginado de persona asociadas a los usuarios del sistema que cumplan con determinados criterios
     * de busqueda.
     *
     * @param $limit
     * @param $start
     * @param $arrUsers
     * @param $filter
     *
     * @return array
     */
    public function getDatosAuxPersona($limit = 20, $start = 0, $arrUsers = array(), $filter = null)
    {
        $obj = new OsimModel();
        return $obj->getDatosAuxPersona($limit, $start, $arrUsers, $filter);
    }

    public function getDatospersonaWeb($provincia,$municipio,$nivel,$area,$insertar)
    {

        if($provincia==1){
            $sql = "SELECT p.iddpt, p.denominacion
				FROM mod_datosmaestros.nom_dpt as p
				INNER JOIN mod_datosmaestros.nom_nivelestructural ON(mod_datosmaestros.nom_nivelestructural.idnivelestructural = p.idnivelestructural)
				INNER JOIN mod_datosmaestros.nom_conceptonivel ON(mod_datosmaestros.nom_conceptonivel.idconceptonivel = mod_datosmaestros.nom_nivelestructural.idconceptonivel)
                WHERE p.idpais = 1 AND mod_datosmaestros.nom_conceptonivel.idconceptonivel = 16";
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

            return $result;
        }
        if($municipio==1){
            $sql = "SELECT p.iddpt, p.denominacion
				FROM mod_datosmaestros.nom_dpt as p
				INNER JOIN mod_datosmaestros.nom_nivelestructural ON(mod_datosmaestros.nom_nivelestructural.idnivelestructural = p.idnivelestructural)
				INNER JOIN mod_datosmaestros.nom_conceptonivel ON(mod_datosmaestros.nom_conceptonivel.idconceptonivel = mod_datosmaestros.nom_nivelestructural.idconceptonivel)
                WHERE p.idpais = 1 AND mod_datosmaestros.nom_conceptonivel.idconceptonivel = 14";
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

            return $result;
        }
        if($nivel==1){
            $sql = "SELECT p.idniveleducacional, p.denominacion
				FROM mod_personaext.nom_niveleducacional as p";
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

            return $result;
        }
        if($area==1){
            $sql = "SELECT p.idareatematicaempresa, p.denominacion, p.descripcion
				FROM mod_personaext.nom_areatematicaempresa as p";
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

            return $result;
        }
        if(count($insertar) > 0){
            $nombre = $insertar[0]['nombre'];
            $snombre = $insertar[0]['snombre'];
            $papel = $insertar[0]['papel'];
            $sapel = $insertar[0]['sapel'];
            $fregistro = date('d-m-Y');
            $sexo = $insertar[0]['sexo'];
            $numero = $insertar[0]['numero'];
            $idprovincia = $insertar[0]['idprovincia'];
            $idmunicipio= $insertar[0]['idmunicipio'];
            $lugar= $insertar[0]['lugar'];
            $contacto= $insertar[0]['contacto'];
            $nivel= $insertar[0]['nivel'];
            $area= $insertar[0]['idarea'];

            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $sqlinsertar = "INSERT INTO mod_persona.dat_persona(
                     nombre, snombre, papel, sapel, fregistro,
                    sexo)
                    VALUES ($nombre,$snombre ,$papel,$sapel,$fregistro,$sexo);";
            $conn->fetchAll($sqlinsertar);

            $sql = "SELECT p.idpersona
                       FROM  mod_persona.dat_persona p
                       ORDER BY p.idpersona DESC";

            $resultid = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

            $idpersona = $resultid[0]['idpersona'];

            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $sqldoc = "INSERT INTO mod_persona.dat_docidentidad(
                     idpersona, idtipodocidentidad, numero, fdesde, principal)
                    VALUES ($idpersona,1 ,$numero,$fregistro,1);";
            $conn->fetchAll($sqldoc);

            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $sqldireccion = "INSERT INTO mod_persona.dat_direccion(
                     idprovincia, idmunicipio,direccion,oficial,fdesde,idpersona,idpais)
                    VALUES ($idprovincia,$idmunicipio,$lugar,1,$fregistro,$idpersona,1);";
            $conn->fetchAll($sqldireccion);

            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $sqlcontacto = "INSERT INTO mod_persona.dat_contacto(
                     contacto, oficial,idtipomediocontacto,idtipocontacto,idpersona)
                    VALUES ($contacto,1,4,1,$idpersona);";
            $conn->fetchAll($sqlcontacto);

            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $sqlnivel = "INSERT INTO mod_personaext.dat_niveleducacional(
                     fdesde, idniveleducacional,idpersona)
                    VALUES ($fregistro,$nivel,$idpersona);";
            $conn->fetchAll($sqlnivel);

            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $sqlnivel = "INSERT INTO mod_personaext.dat_personaareatematicaempresa(
                     fdesde,idpersona,idareatematicaempresa)
                    VALUES ($fregistro,$idpersona,$area);";
            $conn->fetchAll($sqlnivel);
        }

    }

}
