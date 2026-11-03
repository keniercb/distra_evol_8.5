<?php
class ZendExt_CompExImp_Importacion_Fimp_ImportarXML implements ZendExt_CompExImp_IIMportadorConcreto
{
    public function __construct()
    {
    }

    public function importar($dir)
    {
        $xml = simplexml_load_file($dir);
        $obj = $this->importarObj($xml->children());
        return $obj;
    }

    private function importarObj($objeto)
    {
        $nombreclass = $objeto->getName();
        if ($nombreclass == 'Array') {
            $obj = $this->importarArray($objeto);
        } else {
            @$obj = new $nombreclass();
            foreach ($objeto->attributes() as $t => $r) {
                $param = $t;
                $obj->$param = (string )$r[0];
            }
            foreach ($objeto->children() as $hijo) {
                if ($hijo->getName() != "NameVar") {
                    $param = $hijo->NameVar;
                    if ($hijo->getName() == "Array") {
                        $tempobj = $this->importarArray($hijo);
                    } else {
                        $tempobj = $this->importarObj($hijo);
                    }
                    $obj->$param = $tempobj;
                }
            }
        }
        return $obj;
    }

    private function importarArray($objet)
    {
        $obj = array();
        foreach ($objet->attributes() as $t => $r) {
            $num = strpos($t, "keynum");
            if ($num !== false) {
                $num = substr($t, 6);
                $param = $num;
            } else {
                $param = $t;
            }
            $obj[$param] = (string )$r[0];
        }
        foreach ($objet->children() as $hijo) {
            if ($hijo->getName() != "NameVar") {
                $param = (string )$hijo->NameVar;
                $num = strpos($param, "keynum");
                if ($num !== false) {
                    $num = substr($param, 6);
                    $param = $num;
                }
                if ($hijo->getName() == "Array") {
                    $tempobj = $this->importarArray($hijo);
                } else {
                    $tempobj = $this->importarObj($hijo);
                }
                $obj[$param] = $tempobj;
            }
        }
        return $obj;
    }
}
