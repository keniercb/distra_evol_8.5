<?php


class EstandarCodigoBarrasModel extends BaseModel
{

    public function addModEstandarCodigoBarras($datos)
    {
        $idestandarcodigobarra = $datos['idestandarcodigobarra'];
        $denominacion = $datos['denominacion'];
        $sequenciaporentidad = $datos['sequenciaporentidad'];
        $bandera = str_replace(" ","", $datos['bandera']);
        $formato = str_replace(" ","", $datos['formato']);

        if ($idestandarcodigobarra) {
            $obj = Doctrine::getTable('DatEstandarCodigoBarras')
                    ->find($idestandarcodigobarra);
            
            if ($obj->sequenciaporentidad) {
                $globalConcept = ZendExt_GlobalConcept::getInstance();
                $idEstructura = $globalConcept->EstructuraEconomica->idestructuracomun;
            } else {
                $idEstructura = null;
            }
            if (DatEstandarCodigoBarras::existeSequenciaEstandarCodigoBarras($idestandarcodigobarra, $idEstructura)) {
                $oldFormato = $obj->formato;
                $oldSequenciaporentidad = $obj->sequenciaporentidad;
                $offsetLimitFormato = $this->findSquenciaFormat($formato);
                $offsetLimitOldFormato = $this->findSquenciaFormat($oldFormato);
                if ($offsetLimitFormato['limit'] != $offsetLimitOldFormato['limit']) {
                    if ($offsetLimitFormato['limit'] > 0) {
                        DatEstandarCodigoBarras::eliminarSequenciaEstandarCodigoBarras(
                            $idestandarcodigobarra,
                            $idEstructura
                        );
                        DatEstandarCodigoBarras::crearSequenciaEstandarCodigoBarras(
                            $idestandarcodigobarra,
                            $offsetLimitFormato['limit'],
                            $idEstructura
                        );
                    } else if ($offsetLimitFormato['limit'] = 0 && $offsetLimitOldFormato['limit'] > 0) {
                        DatEstandarCodigoBarras::eliminarSequenciaEstandarCodigoBarras(
                            $idestandarcodigobarra,
                            $idEstructura
                        );
                    }
                } else if (boolval($oldSequenciaporentidad) !== boolval($sequenciaporentidad)) {
                    DatEstandarCodigoBarras::eliminarSequenciaEstandarCodigoBarras(
                        $idestandarcodigobarra,
                        $idEstructura
                    );
                }
            }
        }

        $obj = new stdClass();
        $obj->idestandarcodigobarra = $idestandarcodigobarra;
        $obj->denominacion = $denominacion;
        $obj->bandera = $bandera;
        $obj->formato = $formato;
        $obj->sequenciaporentidad = $sequenciaporentidad;

        $idestandarcodigobarranew = DatEstandarCodigoBarras::saveObj($obj);

        return ['codigoMsg' => 1];
    }

    static public function eliminarEstandarCodigoBarras($id)
    {
        DatEstandarCodigoBarras::eliminar($id);
        return ['codigoMsg' => 1];
    }

    static public function setearSequenciaEstandarCodigoBarras($post)
    {
        $id = $post['idestandarcodigobarra'];
        $numero = $post['numero'];
        $EstandarCodigoBarras = DatEstandarCodigoBarras::getById($id);
        if ($EstandarCodigoBarras['sequenciaporentidad']) {
            $globalConcept = ZendExt_GlobalConcept::getInstance();
            $idEstructura = $globalConcept->EstructuraEconomica->idestructuracomun;
        } else {
            $idEstructura = null;
        }

        $offsetLimit = self::findSquenciaFormat($EstandarCodigoBarras['formato']);

        if ($offsetLimit['limit'] == 0) {
            return ['codigoMsg' => -1];
        }

        if (DatEstandarCodigoBarras::existeSequenciaEstandarCodigoBarras($id, $idEstructura)) {
            DatEstandarCodigoBarras::setearSequenciaEstandarCodigoBarras(
                $id, 
                $idEstructura, 
                $numero
            );
            DatEstandarCodigoBarras::actualizarSequenciaTabla($id, $idEstructura, $numero);
        } else {
            DatEstandarCodigoBarras::crearSequenciaEstandarCodigoBarras(
                $id,
                $offsetLimit['limit'],
                $idEstructura
            );
            DatEstandarCodigoBarras::setearSequenciaEstandarCodigoBarras(
                $id, 
                $idEstructura, 
                $numero
            );
        }
        return ['codigoMsg' => 1];
    }

    public function cargarEstandaresCodigoBarra()
    {
        $globalConcept = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $globalConcept->EstructuraEconomica->idestructuracomun;
        $datos = DatEstandarCodigoBarras::cargar([
            'idestructura' => $idEstructura
        ]);
        $cantidad = count($datos) > 0 ? $datos['cantidad'] : 0;
        if ($cantidad === 0) {
            $datos = DatEstandarCodigoBarras::crearEstandareCodigoBarraDefault();
        }
        return ['datos' => $datos, 'cantidad' => $cantidad];
    }

    public function probarEstandarCodigoBarras($datos)
    {
        // $obj = Doctrine::getTable('DatEstandarCodigoBarras')->find($datos['idestandarcodigobarra']);
        // print_r($obj->DatEstandarCodigoBarrasEstructura->toArray());die;
        // print_r(self::comprobarCodigoChequeo('236900000003'));die;
        return $this->generarCodigoBarra($datos['idestandarcodigobarra']);
    }

    public function generarCodigoBarra($id)
    {
		$globalConcept = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $globalConcept->EstructuraEconomica->idestructuracomun;
        $conn = Zend_Registry::get('conexion');
		$res = $conn->fetchAll("
			select *
			from mod_datosmaestros.f_generar_codigo_barra(
				{$id},
				{$idEstructura}
			)
		");

        return [
			'codigoMsg' => $res[0]['codigo_msg'], 
			'msg' => $res[0]['msg'],
			'codigoBarras' => $res[0]['codigo_barra']
		];
    }

    static public function comprobarCodigoChequeo($codigoBarras)
    {
        $conn = Zend_Registry::get('conexion');
		$res = $conn->fetchAll("
			select mod_datosmaestros.f_generar_codigo_chequeo('{$codigoBarras}') as codigochequeo
		");
		
		$codigoChequeoCalculado = $res[0]['codigochequeo'];
		$codigoChequeo = substr($codigoBarras, -1);
		
        if ($codigoChequeoCalculado === -1) {
            return [
                'codigoMsg' => -1,
                'msg' => 'No hay validacion para un codigo de barras de longitud ' . $len
            ];
        }
        return [
            'codigoMsg' => 1,
            'isCorrecto' => $codigoChequeo == $codigoChequeoCalculado,
            'codigoChequeo' => $codigoChequeo,
            'codigoChequeoCalculado' => $codigoChequeoCalculado,
        ];
    }

	static public function findSquenciaFormat($formato)
    {
        return self::findFormat($formato, '/9+/');
    }

	static public function findFormat($formato, $match)
    {
        $matches = [];
        preg_match_all($match, $formato, $matches, PREG_OFFSET_CAPTURE);
        return self::getOffsetLimitMatches($matches);
    }

	static public function getOffsetLimitMatches($matches)
    {
        $matches = $matches[0];
        if (count($matches) > 0) {
            $offset = $matches[0][1];
            $limit = strlen($matches[0][0]);
            return ['offset' => $offset, 'limit' => $limit];
        } else {
            return ['offset' => 0, 'limit' => 0];
        }
    }

}

