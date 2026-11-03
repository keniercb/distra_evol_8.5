<?php
class MovimientoslaboralesService extends ZendExt_Model
{
    public function getActiveTiposContrato()
    {
        $objModel = new NomTipocontratoModel();
        return $objModel->getActiveTiposContrato();
    }

    public function getActiveMotivosMovimiento()
    {
        $objModel = new NomMotivomovimientoModel();
        return $objModel->getMotivoMovimiento();
    }
    public function getDenomById($idmotivomovimiento)
    {
        $objModel = new NomMotivomovimientoModel();
        return $objModel->getDenomById($idmotivomovimiento);
    }

    public function getActiveMotivosBaja()
    {
        $objModel = new NomMotivobajaModel();
        return $objModel->getMotivoBaja();
    }

    public function getActiveSituaciones($asociadocargo)
    {
        $objModel = new NomSituacionModel();
        return $objModel->getAllSituation(true, $asociadocargo);
    }

    public function getTrayectoriaLaboralPersona($idpersona)
    {
        include_once('models/domain/DatSituacionlaboral.php');
        $objModel = new DatSituacionlaboral();
        return $objModel->getTrayectoriaLaboralPersona($idpersona);
    }

    public function addTrayectoriaLaboralPersona(
        $idpersona, $identidad, $fdesde, $fhasta, $idcargo, $idsituacion, $noalta, $idtipocontrato, $idarea,
        $principal, $idprocedenciasocial
    )
    {
        $objModel = new DatSituacionlaboralModel();
        return $objModel->darAlta(
            $idpersona,
            $identidad,
            $fdesde,
            $fhasta,
            $idcargo,
            $idsituacion,
            $noalta,
            $idtipocontrato,
            $idarea,
            null,
            $principal,
            $idprocedenciasocial,
            null,
            null
        );
    }

    public function setTrayectoriaLaboralPersona(
        $idsituacionlaboralp,
        $identidad,
        $fdesde,
        $fhasta,
        $idsituacion,
        $noalta,
        $idtipocontrato,
        $idarea,
        $principal,
        $idcargo,
        $idprocedenciasocial
    )
    {
        $objModel = new DatSituacionlaboralModel();
        return $objModel->setAlta(
            $idsituacionlaboralp,
            $identidad,
            $fdesde,
            $fhasta,
            $idsituacion,
            $noalta,
            $idtipocontrato,
            $idarea,
            $principal,
            $idcargo,
            $idprocedenciasocial,
            null
        );
    }

    public function deleteTrayectoriaLaboralPersona($idsituacionlaboralp)
    {
        $objModel = new DatSituacionlaboralModel();
        return $objModel->deleteSituacionLaboral($idsituacionlaboralp);
    }
    
    public function getSituacionLabPorPersonaEntidad($identidad, $idperson)
    {
        include_once('models/domain/DatSituacionlaboral.php');
        $arrcargossubordinados = $this->integrator->metadatos->obtenerCargosEstructura($identidad);
        foreach($arrcargossubordinados as $cargo){
            $rcargos[] = $cargo['idcargo'];
        }
        $rcargcomp = implode(',',$rcargos);
        $objModel = new DatSituacionlaboral();
        $r = $objModel->getSituacionLabPorPersonaEntidadCargos($idperson, $rcargcomp);
        return $r;
    }

    public function getDatosPersonaReserva($idpersona)
    {
        $datos = $this->getDatosPersona($idpersona);
        foreach ($datos as $k => $val) {
            $cargo = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idcargo']);
            $datos[$k]['cargo'] = $cargo[0]->denominacion;
            $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idarea']);
            $datos[$k]['area'] = $area[0]->denominacion;
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['identidad']);
            $datos[$k]['entidad'] = $entidad[0]->denominacion;
        }
        return $datos;
    }

    public function getSituacionesLaborales(
        $filtro,
        $idestructura,
        $idcargo,
        $inicio,
        $limite,
        $activo
    )
    {
        $obj = new DatSituacionlaboralModel();
        $datos = $obj->getSituacionLaboral(
            $filtro,
            $idestructura,
            $idcargo,
            $inicio,
            $limite,
            $activo,
            null,
            null,
            null
        );
        return $datos;
    }

    function getGraficasApk($idusuario, $iddominio, $idestructura, $fecha)
    {
        $modeloNegocio = new ResumenEstadisticoModel();
        $r = $modeloNegocio->getGraficasApk(
            $idusuario,
            $iddominio,
            $idestructura,
            $fecha
        );
        return $r;
    }

    public function obtenerCargosPorPersonaEntidad($idpersona, $idestructura){
        $obj = new DatSituacionlaboralModel();
        return $obj->obtenerCargosPorPersonaEntidad($idpersona, $idestructura);
    }


    private function getDatosPersona($idpersona)
    {
        $sql = "SELECT
        dr.*
        , sl.idcargo as idcargoactual
        , sl.idarea
        , pe.identidad
        FROM mod_fuerzatrabajo.dat_reserva AS dr
        INNER JOIN mod_persona.dat_persona AS dp ON (dr.idpersona = dp.idpersona)
        LEFT JOIN mod_persona.dat_docidentidad AS ident ON (dp.idpersona = ident.idpersona 
        AND ident.principal = 1 AND (ident.fhasta > now() OR ident.fhasta IS NULL))
        LEFT JOIN mod_persona.dat_personaentidad AS pe  ON (dp.idpersona = pe.idpersona 
        AND (pe.fhasta > now() OR pe.fhasta IS NULL))
        LEFT JOIN mod_persona.dat_situacionlaboral AS sl  ON (pe.idpersonaentidad = sl.idpersonaentidad 
        AND sl.principal = 1 AND (sl.fhasta > now() OR sl.fhasta IS NULL))
        WHERE dr.idpersona in (" . implode(',', $idpersona) . ")";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}