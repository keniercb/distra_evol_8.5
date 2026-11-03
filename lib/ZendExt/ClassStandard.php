<?php

class ZendExt_ClassStandard {

    public static function ArrayObject($arraydata) {
        $arrayobj = NULL;
        if (!$arraydata)
            return array();
        $fields = array_keys($arraydata[0]);
        $i = 0;
        foreach ($arraydata as $vlp) {
            foreach ($fields as $d){
                $arrayobj[$i]->$d = $vlp[$d];
            }
            $i++;
        }
        return $arrayobj;
    }

    public static function Object($arraydata) {
        if (!$arraydata)
            return new stdClass();
        $object = new stdClass();
        $fields = array_keys($arraydata[0]);
        foreach ($fields as $j => $d)
            $object->$d = $arraydata[0][$d];
        return $object;
    }

}
