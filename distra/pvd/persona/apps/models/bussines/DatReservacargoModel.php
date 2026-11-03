<?php

class DatReservacargoModel extends ZendExt_Model
{

    protected $objReserva;
    protected $objEstructuraService;
    protected $response;

    function __construct()
    {
        $this->objReserva = new DatReservacargo();
        $this->objEstructuraService = new EyCServices();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getReservasCargo($filtro, $idestructura, $limit = null, $start = 0)
    {
        $cargos = empty($idestructura) ? Utiles::getArryOfCargos(
            ZendExt_GlobalConcept::getInstance()->Perfil->idestructuracomun, true
        ) : Utiles::getArryOfCargos($idestructura, true);
        $this->response->data = $this->objReserva->getReserva($filtro, $cargos, $limit, $start);
        $this->response->quantity = $limit > 0
            ? $this->objReserva->getCantReserva($filtro, $cargos)
            : count(
                $this->response->data
            );
        foreach ($this->response->data as $k => $v) {
            $data[$k] = array(
                'idpersonaentidad' => $v['dpen_idpersonaentidad'], 'idpersona' => $v['dp_idpersona'],
                'identidad' => $v['dpen_identidad'], 'denomentidad' => $v['dpen_entidad'], 'falta' => $v['dpen_falta'],
                'idreservacargo' => $v['dpr_idreservacargo'], 'fdesde' => $v['dpr_fdesde'], 'fhasta' => $v['dpr_fhasta'],
                'idcargo' => $v['dpr_idcargo'], 'sustituto' => $v['dpr_sustituto'], 'numid' => $v['dpident_numid'],
                'nombreapellidos' => $v['dp_nombreapellidos'], 'sexo' => $v['dp_sexo'], 'foto' => $v['dpfot_foto'],);
            if (!empty($v['dpr_idcargo'])) {
                $ruta = $this->objEstructuraService->getRutaEstructura(array($v['dpr_idcargo']));
                $tmp = explode('/', $ruta[0]['rutaDenominacion']);
                $data[$k]['denomarea'] = $tmp[count($tmp) - 2];
                $data[$k]['denomcargo'] = $tmp[count($tmp) - 1];
                $data[$k]['ruta'] = '<span style="color:red;">' . $data[$k]['denomentidad'] .
                    '</span>-><span style="color:black;">' . $data[$k]['denomarea'] . '</span>-><span style="color:green;">' .
                    $data[$k]['denomcargo'] . '</span>';
            }
        }
        $this->response->data = $data;

        return $this->response;
    }

    public function getPersonaToReserva($filtro = null, $idEntidad, $idCargo, $limit = null, $start = 0)
    {
        $this->response->data = $this->objReserva->getPersonasToReserva(
            $filtro, $idEntidad, $idCargo, $limit, $start
        );
        $this->response->quantity = $limit > 0 ? $this->objReserva->getCantPersonasToReserva(
            $filtro, $idEntidad, $idCargo
        ) : count($this->response->data);

        return $this->response;
    }

    public function addReservaCargo(array $data)
    {
        try {
            $collection = new Doctrine_Collection('DatReservacargo');
            foreach ($data as $p => $array) {
                foreach ($array as $k => $v) {
                    $collection[$p][$k] = $v !== '' ? $v : null;
                }
            }
            $collection->save();
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modReservaCargo(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objReserva->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idreservacargo] as $k => $val) {
                            $collection[$p]->$k = $val !== '' ? $val : null;
                        }
                    }
                    if ($collection->isModified()) {
                        $collection->save();
                    }
                }
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function delReservaCargo($id)
    {
        try {
            $this->objReserva->delReservaCargo($id);
        } catch (Exception $e) {
            throw $e;
        }
    }
}

