<?php

class DatDocumentoaprobacionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatDocumentoaprobacion($datDocumentoaprobacion)
    {

        $datDocumentoaprobacion->save();
        return $datDocumentoaprobacion->iddocumentoaprobacion;
    }

    public function modificardatDocumentoaprobacion($datDocumentoaprobacion)
    {
        $datDocumentoaprobacion->save();
    }

    public function eliminardatDocumentoaprobacion($datDocumentoaprobacion)
    {
        $datDocumentoaprobacion->delete();
    }

    public function verDocumentoManual($iddocumento, $start, $limit, $parametros
    )
    {
        $resul = DatDocumentoaprobacion::getdatosDocumentoManual(
            $parametros, $iddocumento, $start, $limit
        );
        return $resul;
    }

    public function verDocumentototal($identidad, $iddocumento, $parametros)
    {
        return DatDocumentoaprobacion::cuerpoDocumentototal(
            $identidad, $iddocumento, $parametros
        );
    }

    public function eliminar($id)
    {
        $query = Doctrine_Query::create();
        $queryUno = Doctrine_Query::create();
        $query->addWhere('ap.idaprobacion <> 4');
        $query->delete('DatDocumentoaprobacion ap')->whereIn(
            'ap.iddocumentoaprobacion', $id
        );
        $res = $query->execute();
        if ($res) {
            $queryUno->delete('DatDocumentoaprobcontroldivisaindicador ap')
                ->whereIn('ap.iddocumentoaprobacion', $id);
            return $queryUno->execute();
        } else {
            return $res;
        }
    }

    public function AprobarDesaprobar($iddocumento, $aprobacion)
    {
        $query = Doctrine_Query::create();
        if ($aprobacion) {

            $query->update('DatDocumentoaprobacion')->set(
                'idaprobacion', $aprobacion
            )->where(
                'iddocumentoaprobacion=?', $iddocumento
            );
            return $query->execute();
        }
    }

    public function cuerpoDocumento($identidad, $iddocumento, $start, $limit)
    {
        $result = DatDocumentoaprobacion::getIndicadoresDocumento(
            $identidad, $iddocumento, $start, $limit
        );

        return $result;
    }

    public function listarOperaciones()
    {
        $result = DatDocumentoaprobacion::listarOperaciones();
        return $result;
    }

    public function listarTipoAprobacion()
    {
        $result = DatDocumentoaprobacion::listarTipoAprobacion();
        return $result;
    }

    public function listarAprobaciones()
    {
        $centbal = DatEntidaddatosnomenclador::getCB();

        $i = 0;
        $dat = array();
        if ($centbal) {
            foreach ($centbal as $valor) {
                $dat[$i]['id'] = $valor['identidad'];
                $enti = $this->integrator->metadatos->DameEstructura(
                    $valor['identidad']
                );
                $dat[$i]['text'] = $enti[0]->denominacion;
                $dat[$i]['leaf'] = true;
                $i++;
            }

            $datos = $dat;
        } else {
            $datos = 1;
        }
        return $datos;
    }

    public function Adicionardocumentomanual(
        $arraydatosdoc, $origen, $iddocumentoorigen, $idoperacion, $identidad,
        $idtipoaprobacion, $idusuario,
        $idejercicio, $numerodoc
    )
    {
        $numero = DatDocumentoaprobacion::ultimoNumero($identidad);

        $documento = new DatDocumentoaprobacion();
        $documento->esmanual = $origen;
        $documento->identidad = $identidad;
        $documento->idejercicio = $idejercicio;
        $documento->idusuario = $idusuario;
        $documento->numeroaprobacion = $numerodoc . '.' . $numero;
        if (isset($iddocumentoorigen)) {
            $documento->iddocumentoorigen = $iddocumentoorigen;
        }
        $documento->idtipoaprobacion = $idtipoaprobacion;
        $documento->idoperacion = $idoperacion;
        $documento->idaprobacion = 1;
        $documento->numero = $numero;
        $documento->save();
        $iddocumento = $documento->iddocumentoaprobacion;
        foreach ($arraydatosdoc as $datosdocumento) {
            $objdocaprobCD = new DatControldivisadocumentoaprobacion();
            $objdocaprobCD->idcontroldivisa = $datosdocumento->idcontroldivisa;
            $objdocaprobCD->importe = $datosdocumento->importe;
            $objdocaprobCD->iddocumentoaprobacion = $iddocumento;
            $objdocaprobCD->save();

            $objdocVia = new DatControldivisadocumentoviaadquisicion();
            $objdocVia->idcontroldivisadocumentoaprobacion
                = $objdocaprobCD->idcontroldivisadocumentoaprobacion;
            $objdocVia->idviaadquisicion = $datosdocumento->idvia;
            $objdocVia->save();

            if ($datosdocumento->idconceptoplan) {
                $objdocModelo = new DatControldivisadocumentomodelo();
                $objdocModelo->iddestino = $datosdocumento->idconceptoplan;
                $objdocModelo->idcontroldivisadocumentoaprobacion
                    = $objdocaprobCD->idcontroldivisadocumentoaprobacion;
                $objdocModelo->save();
            }
        }
        return 1;
    }

}


