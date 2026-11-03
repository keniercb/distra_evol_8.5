<?php

class DatImportardocumentoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function subirDocumento($file, $params = array())
    {
        $fileTempName = $file['file']['tmp_name'];
        $fileName = ($params['file_name']) ? $params['file_name'] : $file['file']['name'];
        $filepath = fopen($fileTempName, "r");

        $contents = file_get_contents($fileTempName);

        if ($filepath === false OR $filepath === '') {
            $filepath = sys_get_temp_dir();
        }
        $dir = $_SERVER['DOCUMENT_ROOT']. '/../apps/planificacion/planmeta/models/bussines/importarxls';
        $fichero = $dir . '/' . $fileName;
        $rsult = file_put_contents($fichero, $contents);

        if ($rsult >= 0) {
            $documento = new DatCargadocumento();
            $documento->denominacion = $fileName;
            $documento->hora = date('H:i:s');
            $documento->fecha = date('d/m/Y');
            $documento->idusuario = $params['idusuario'];
            $documento->idtipomaterial = $params['idtipomaterial'];
            $documento->save();
            return array('cod' => 1);
        } else {
            return array('cod' => 3);
        }
    }

    public function listarDatos($parametros) {
        $arrayexis = DatCargadocumento::listarDocumentosConTipomaterial(
                        $parametros
        );
        $array = array();
        foreach ($arrayexis as $key => $value) {
            if ($key < 20) {
                $array[$key]['denominacion'] = $value['denominacion'];
                $array[$key]['tipomaterial'] = $value['idtipomaterial'];
                $array[$key]['cargo'] = $value['idcargadocumento'];
                $array[$key]['fecha'] = $value['fecha'];
                $array[$key]['hora'] = $value['hora'];
            }
        }

        $data[0] = $array;
        $data[1] = $arrayexis[20]['total'];

        return $data;
    }

    public function eliminarDocumento($file) {
        $dir = $_SERVER['DOCUMENT_ROOT']
                . '/../apps/planificacion/planmeta/models/bussines/importarxls';
        DatCargadocumento::eliminarDocumento($file);
        unlink($dir . '/' . $file);
        return 1;
    }

}
