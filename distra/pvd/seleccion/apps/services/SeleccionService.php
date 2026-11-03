<?php
class SeleccionService extends ZendExt_Model
{
    public function getCandidatosSeleccionadosByUbicacion(
        $start,
        $limit,
        $ubicaciones,
        $idcargo,
        $numid,
        $nombre,
        $papel,
        $sapel
    )
    {
        $idestructuras = '';
        foreach ($ubicaciones as $i => $val) {
            $idestructuras .= $val;
            if ($i < count($ubicaciones) - 1) {
                $idestructuras .= ',';
            }
        }
        $objModel = new DatResultadoseleccionModel();
        return $objModel->getCandidatosSeleccionadosByUbicacion(
            $start,
            $limit,
            $idestructuras,
            $idcargo,
            $numid,
            $nombre,
            $papel,
            $sapel
        );
    }

    public function getEstados()
    {
        $valores = array(
            array('idestado' => 3, 'denominacion' => 'En proceso'),
            array('idestado' => 1, 'denominacion' => 'Pre selecionado'),
            array('idestado' => 2, 'denominacion' => 'Seleccionado'),
            array('idestado' => 0, 'denominacion' => 'Excluido')
        );
        return $valores;
    }

    public function getProcesosActivos()
    {
        $objModel = new DatProcesoModel();
        return $objModel->getProcesosActivos();
    }

    public function getProcesosByPersona($idpersona)
    {
        $objModel = new DatCandidatoModel();
        return $objModel->getProcesosByPersona($idpersona);
    }

    public function getViasReclutamiento()
    {
        $objModel = new NomViareclutamiento();
        return $objModel->getViasReclutamientoActivas();
    }

    public function addProcesoActivo($valores, $idpersona)
    {
        $objModel = new DatCandidatoModel();
        return $objModel->addProcesoActivo($valores, $idpersona);
    }

    public function modProcesoActivo($valores, $id)
    {
        $objModel = new DatCandidatoModel();
        return $objModel->modProcesoActivo($valores, $id);
    }

    public function delProcesoActivo($valores, $idpersona)
    {
        $objModel = new DatCandidatoModel();
        return $objModel->delProcesoActivo($valores, $idpersona);
    }

    public function getEstadoCandidatos($start, $limit, $filtro, array $personas)
    {
        return DatCandidatoModel::getRecCandidato($start, $limit, $filtro, null, null, $personas);
    }
}