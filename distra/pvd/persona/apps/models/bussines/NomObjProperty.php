<?php

class NomObjProperty
{

    private $treeObjProperty;

    function __construct()
    {
        $modulo_path = Zend_Registry::getInstance()->config->modulo_path;
        $modulo_path = $modulo_path . 'comun/recursos/json/' . 'treeObjPropertys.json';
        if (file_exists($modulo_path)) {
            if (is_readable($modulo_path)) {
                $this->treeObjProperty = json_decode(file_get_contents($modulo_path));
            }
        }
    }

    public function getListOfCmp()
    {
        $arrTmp = array();
        $cont = 0;
        foreach ($this->treeObjProperty as $k => $v) {
            $arrTmp[$cont]['denom'] = $k;
            $arrTmp[$cont]['xtype'] = $v->xtype;
            $arrTmp[$cont]['url'] = $v->url;
            $arrTmp[$cont]['cmp'] = $v->componente;
            $cont++;
        }

        return $arrTmp;
    }

    public function getPropertysByCmp($cmp)
    {
        $arrTmp = new stdClass();
        if (!empty($this->treeObjProperty->$cmp)) {
            $arrTmp = $this->getPropertysByCmp($this->treeObjProperty->$cmp->herencia);
            if (is_array($this->treeObjProperty->$cmp->pProperty)) {
                foreach ($this->treeObjProperty->$cmp->pProperty as $v) {
                    $index = $v->denom;
                    $arrTmp->$index = array(
                        'default' => $v->default, 'type' => $v->type, 'origen' => $cmp);
                }
            }

            return $arrTmp;
        } else {
            return $arrTmp;
        }
    }

    public function getEventsByCmp($cmp)
    {
        try {
            $arrTmp = new stdClass();
            if (!empty($this->treeObjProperty->$cmp)) {
                $arrTmp = $this->getEventsByCmp($this->treeObjProperty->$cmp->herencia);
                if (is_array($this->treeObjProperty->$cmp->events)) {
                    foreach ($this->treeObjProperty->$cmp->events as $v) {
                        $index = $v->denom;
                        $arrTmp->$index = array(
                            'default' => $v->default, 'type' => $v->type, 'origen' => $cmp);
                    }
                }

                return $arrTmp;
            } else {
                return $arrTmp;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

}