<?php

class ConfiguracionreporteModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();

    }

    public function cargarGridCentral($params)
    {
        $classEstructura = 'Estructura';
        if ($params['idestructura']) {
            $idestructura = $params['idestructura'];
        }
        else
        $idestructura = $this->global->$classEstructura->idestructura;
        $query = new Doctrine_Query();
        $query->from('CfgReporte r');
        $query->select(
            'r.nombrecampo as nombre, r.idreporte, r.idconfreporteaft , re.idestructura as idestructura,
             re.valor as valor, re.idconfreporteaftentidad as idconfreporteaftentidad'
        );
        $query->leftJoin("r.CfgReporteEntidad re ON re.idestructura = {$idestructura} AND re.idconfreporteaft = r.idconfreporteaft")
            ->where('r.idreporte = ?', array($params['idreporte']));
           // ->addWhere('re.idestructura = ?', array($idestructura));
        $total = $query->count();
        if ($params['limit']) {
            $query->limit($params['limit']);
            $query->offset($params['start']);
        }
        $query->orderBy('r.idconfreporteaft');
       // print_r($query->getSqlQuery());die;
        $result = $query->fetchArray();

        return array($total, $result);
    }

    public function getGuardarDatos($params, $idestructura)
    {
        $classEstructura = 'Estructura';
        if (!$idestructura) {
            $idestructura = $this->global->$classEstructura->idestructura;  ;
        }

        foreach ($params as $dat) {
            settype($dat,"Array");

            $confreporen= Doctrine::getTable('CfgReporteEntidad')
                ->findByDql(
                    'idconfreporteaft =? and idestructura =?', array($dat['idconfreporteaft'], $idestructura)
                );

            if (count($confreporen) > 0) {
                $confreporen[0]->synchronizeWithArray($dat);
                $confreporen->save();

        } else {
                $confreporentidad = new CfgReporteEntidad();
                $confreporentidad->synchronizeWithArray($dat);
                $confreporentidad->idestructura = ($dat['idestructura']) ? $dat['idestructura'] : $idestructura;
                $confreporentidad->save();
            }


        }
    }

}
