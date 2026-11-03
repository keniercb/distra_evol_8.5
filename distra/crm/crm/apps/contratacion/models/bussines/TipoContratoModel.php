<?php

/**
 *
 *
 * @author         Ing. Lisvany Alonso Martinez
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Bussines
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class TipoContratoModel extends ZendExt_Model
{
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function guardarTipoContrato($data)
    {
        if (!empty($data['addData'])) {
            $addData = json_decode($data['addData']);
            $resulAdd = self::addTipoContrato($addData);
        }
        if (!empty($data['upData'])) {
            $upData = json_decode($data['upData']);
            $resulUp = self::upTipoContrato($upData);
        }
        if (!empty($data['delData'])) {
            $delData = json_decode($data['delData']);
            $resulDel = self::delTipoContrato($delData);
        }
        $fallos = $this->getFails($resulAdd, $resulUp, $resulDel);
        if (empty($fallos)) {
            return array('success' => true);
        } else {
            return array('success' => false, 'fallos' => $fallos);
        }
    }

    private function addTipoContrato($addData)
    {
        $addEx = array();
        foreach ($addData as $add) {
            $query = "INSERT INTO "
                . "mod_crmcontratacion.dat_tipocontrato(denominacion,idestructuracomun,compartimentacion, cliente)";
            $query .= " VALUES ('" . $add->denominacion . "'," . $this->global->Estructura->idestructura . ",'" .
                json_encode($add->compartimentacion) . "', $add->cliente ) ";
            $query .= " RETURNING idtipocontrato ;";
            $ex = $this->executeQuery($query);
            if (!$ex) {
                $addEx[] = $add->denominacion;
            }
        }
        if (empty($addEx)) {
            return array('success' => true);
        }

        return array('success' => false, $addEx);
    }

    private function upTipoContrato($upData)
    {
        $upEx = array();
        foreach ($upData as $up) {
            $query = "UPDATE mod_crmcontratacion.dat_tipocontrato SET denominacion = '" . $up->denominacion . "',
                      compartimentacion = '" . json_encode($up->compartimentacion) . "',cliente = $up->cliente";
            $query .= " WHERE idtipocontrato = " . $up->idtipocontrato . " RETURNING idtipocontrato ;";
            $ex = $this->executeQuery($query);
            if (!$ex) {
                $upEx[] = $up->denominacion;
            }
        }
        if (empty($upEx)) {
            return array('success' => true);
        }

        return array('success' => false, $upEx);
    }

    private function delTipoContrato($delData)
    {
        $upEx = array();
        foreach ($delData as $del) {
            $query = "DELETE FROM mod_crmcontratacion.dat_tipocontrato ";
            $query .= " WHERE idtipocontrato = " . $del->idtipocontrato . " RETURNING idtipocontrato ;";
            $ex = $this->executeQuery($query);
            if (!$ex) {
                $upEx[] = $del->denominacion;
            }
        }
        if (empty($upEx)) {
            return array('success' => true);
        }

        return array('success' => false, $upEx);
    }

    /**
     * @param $query
     *
     * @return string
     * @throws Doctrine_Connection_Exception
     */
    private function executeQuery($query)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $statementCant = $conexionActual->execute($query);
            return $statementCant->fetchColumn(0);
        } catch (Exception $e) {
            throw $e;
            return false;
        }
    }

    public function addIsNotBeTipoContrato()
    {
        $addData = [
            ["denominacion" => 'Contrato Marco', "tipo" => "0", "editable" => "0", "cliente" => "1",],
            ["denominacion" => 'Tipos de Contratos', "tipo" => "1", "editable" => "0", "cliente" => "1",],
            ["denominacion" => 'Contrato Marco', "tipo" => "0", "editable" => "0", "cliente" => "0"],
            ["denominacion" => 'Tipos de Contratos', "tipo" => "1", "editable" => "0", "cliente" => "0",]
        ];
        $addEx = array();
        foreach ($addData as $add) {
            $query
                = "INSERT INTO
                        mod_crmcontratacion.dat_tipocontrato(denominacion,idestructuracomun,tipo,editable,cliente) ";
            $query .= " VALUES ('" . $add['denominacion'] . "'," . $this->global->Estructura->idestructura . ","
                . $add['tipo'] . "," . $add['editable'] . "," . $add['cliente'] . ") RETURNING idtipocontrato ;";
            $ex = $this->executeQuery($query);
            if (!$ex) {
                $addEx[] = $add->denominacion;
            }
        }
        if (empty($addEx)) {
            return array('success' => true);
        }

        return array('success' => false, $addEx);
    }

    public function getComponent($array, $dir)
    {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $dataComponent = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'web/crm/application/views/js/app/module/Contratacion/module/tipocontrato/dataComponent/' . $dir;
        $files = scandir($dataComponent);

        foreach ($files as $file) {
            if (substr($file, -3) == '.js') {
                $name = substr($file, 0, -3);
                $nameHumanLabel = substr(strtoupper($file), 0, -3);
                $humanLabel = str_replace('_', ' ', $nameHumanLabel);
                $array[] = ['namecomponent' => $name, 'tipo' => $dir, 'humanlabel' => $humanLabel];
            }
        }
        return $array;
    }

    /**
     * @param $resulAdd
     * @param $resulUp
     * @param $resulDel
     *
     * @return array
     */
    private function getFails($resulAdd, $resulUp, $resulDel)
    {
        $fallos = array();
        if (!$resulAdd['success']) {
            $tmp = array();
            foreach ($resulAdd[0] as $r) {
                if ($r['success']) {
                    $tmp[] = $r;
                }
            }
            if (!empty($tmp)) {
                $fallos['add'] = $tmp;
            }
        }
        if (!$resulUp['success']) {
            $tmp = array();
            foreach ($resulUp[0] as $r) {
                if ($r['success']) {
                    $tmp[] = $r;
                }
            }
            if (!empty($tmp)) {
                $fallos['edit'] = $tmp;
            }
        }
        if (!$resulDel['success']) {
            $tmp = array();
            foreach ($resulDel[0] as $r) {
                if ($r['success']) {
                    $tmp[] = $r;
                }
            }
            if (!empty($tmp)) {
                $fallos['del'] = $tmp;
                return $fallos;
            }
            return $fallos;
        }
        return $fallos;
    }

    public function usarEnEntidad($params){
        try{
            $idestructura=$this->global->Estructura->idestructura;
            $usar=$params['usar']=='true';
            $ids = json_decode($params['arrayIds']);
//            print_r($usar);print(' ----- ');
//            print_r($ids);die;
            if($usar){
                foreach ($ids as $id){
                    $seleccionado = Doctrine::getTable('DatTipoContratoEntidad')->findBySql(
                        'idtipocontrato='.$id.' AND idestructuracomun='.$idestructura)->getFirst();
//                    print_r($seleccionado);
                    if(!$seleccionado) {
//                        print('yeaa');die;
                        $interface = new DatTipoContratoEntidad();
                        $interface->idtipocontrato=$id;
                        $interface->idestructuracomun = $idestructura;
                        $interface->save();
                    }
                }
            }else{
                $query = Doctrine_Query::create()
                    ->delete('DatTipoContratoEntidad')
                    ->whereIn('idtipocontrato', $ids)
                    ->addWhere('idestructuracomun = ?', $idestructura)
                    ->execute();
            }

            return array('success'=>true);
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }

    }
}
