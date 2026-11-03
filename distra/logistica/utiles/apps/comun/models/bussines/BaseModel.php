<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseModel
 *
 * @author kenier
 */
class BaseModel extends ZendExt_Model
{

    private $jsonComponent;

    public function __construct($esExterno = false)
    {
        parent::ZendExt_Model();
        $this->jsonComponent = JSONComponent::__init();
        $this->jsonComponent->loadDefinitionsFile('cmp.definitions');
        if (!$esExterno) {
            $this->inicializarConfiguracion();
        }
    }

    public function __get($name)
    {
        if (stripos($name, 'Helper') == -1) {
            if (isset($this->$name)) {
                return $this->$name;
            }
        } else {
            return LogisticaGlobal::__init()->getHelperInstance($name);
        }
    }

    public function __set($name, $value)
    {
        if (isset($this->$name)) {
            $this->$name = $value;
        }
    }

    public function existComponent($strComponent)
    {
        return $this->jsonComponent->getComponent($strComponent, true);
    }

    private function inicializarConfiguracion()
    {        
        $cant = LogisticaDoctrineHelper::__init()->getConnection()
            ->fetchAll('SELECT COUNT(idestructura) AS cant FROM '
            . 'mod_logistica.conf_general m where idestructura = ' . $this->global->Estructura->idestructura);        
        if ($cant[0]['cant'] == 0) {
            $cfg = new CfgGeneral();
            $cfg->synchronizeWithArray(array(
                'idestructura' => $this->global->Estructura->idestructura
            ));
            $cfg->save();
        }
    }
    
    public function proccessFilters(&$uiParams) {
        $uiParams['filter'] = json_encode($uiParams['filter']);
        if ($uiParams['filter']) {
            $params = json_decode($uiParams['filter']);            
            $comparaciones = array();
            foreach ($params as $searchParam) {
                if ($searchParam->type == 'numeric' && $searchParam->comparison != 'eq') {
                    array_push($comparaciones, array(
                        'campo' => $searchParam->field,
                        'valor' => $searchParam->value,
                        'signo' => $searchParam->comparison == 'gt' ? '>' : '<',
                    ));
                }
                else {
                    $uiParams[$searchParam->field] = $searchParam->data->value;
                }
            }
            $uiParams['comparaciones'] = $comparaciones;
            unset($uiParams['filter']);
        }
    }

    public function getOrderByProduct(&$query,$aliasind='i',$aliasmov='mov',$aliasnat='nat'){
        if (class_exists("ConfiguracioninventarioService")) {
            $objConf = new ConfiguracioninventarioService();
            $cfgInv = $objConf->devolverConfiguracion($this->global->Estructura->idestructura);
            $ordenproducto = $cfgInv['ordenproducto'];
            if($ordenproducto != 3){
                $order = ($ordenproducto == 1)?'codigo':($ordenproducto == 4 ?'numeropieza':'denominacion');
                $query->orderBy((($ordenproducto == 5)?$aliasnat:$aliasind).".".$order,'ASC');
            }else{
                $query->orderBy($aliasmov.".idmovimiento",'ASC');
            }
        }
    }

}
