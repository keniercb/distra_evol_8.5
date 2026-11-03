

<?php
/**
 * @author:  Tte Frank Rodriguez Berroa
 */
class DatConvenioModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function DatConvenioModel() {
        parent::ZendExt_Model();
    }
	
	public function obtenerListadoConvenios($identidad){
	   $inicio = 0;
	   $limite = 20;
	   $cont = 0;
	   $arrayfinal = array();
	   $objObra = new NomObra();
	   $objDatConvenio = new DatConvenio();
	   $array = $objDatConvenio->getConvenios($identidad);
	   foreach($array as $i=>$value){
	     $arrayfinal[$cont]['idconvenio'] = $value['idconvenio'];
	     $arrayfinal[$cont]['denominacion'] = $value['denominacion'];
	     $arrayfinal[$cont]['idobra'] = $value['idobra'];
	     $arrayfinal[$cont]['obra'] = $objObra->obtenerDenominacion($value['idobra']);
	     $arrayfinal[$cont]['fechainicio'] = $value['fechainicio'];
	     $arrayfinal[$cont]['fechafin'] = $value['fechafin'];
	     $arrayfinal[$cont]['descripcion'] = $value['descripcion'];
	     $arrayfinal[$cont]['identidad'] = $value['identidad'];
	     $arrayfinal[$cont]['numeroconvenio'] = $value['numeroconvenio'];
	     $arrayfinal[$cont]['porcientoejecucion'] = $value['porcientoejecucion'];
	     $arrayfinal[$cont]['salario'] = $value['salario'];
	     $arrayfinal[$cont]['penalizacion'] = $value['penalizacion'];
		 $arrayfinal[$cont]['definido'] = $value['definido'];
		 $arrayfinal[$cont]['aprobado'] = $value['aprobado'];
		 $arrayfinal[$cont]['horas'] = $value['horas'];
		 $cont++;
	   }
	   return $arrayfinal;
	}
	
	public function obtenerCantidadConvenios($identidad){
	   $objDatConvenio = new DatConvenio();
	   $cantidad = $objDatConvenio->getTotalCount($identidad);
	   return $cantidad;
	}

    public function adicionarDatosConvenio($numeroconvenio, $denominacion, $idobra, $porcientoejecucion, $salario, $penalizacion, $fechainicio, $fechafin, $descripcion, $identidad){
	   $objDatConvenio = new DatConvenio();
	   $objDatConvenio->numeroconvenio = $numeroconvenio;
	   $objDatConvenio->denominacion = $denominacion;
	   $objDatConvenio->idobra = $idobra;
	   $objDatConvenio->porcientoejecucion = $porcientoejecucion;
	   $objDatConvenio->salario = $salario;
	   $objDatConvenio->penalizacion = $penalizacion;
	   $objDatConvenio->fechainicio = $fechainicio;
	   $objDatConvenio->fechafin = $fechafin;
	   $objDatConvenio->descripcion = $descripcion;
	   $objDatConvenio->identidad = $identidad;
	   $objDatConvenio->save();
	}
	
	public function modificarDatosConvenio($idconvenio, $numeroconvenio, $denominacion, $idobra, $porcientoejecucion, $salario, $penalizacion, $fechainicio, $fechafin, $descripcion, $identidad){
	   $objDatConvenioBuscar = new DatConvenio();
	   $objDatConvenio = $objDatConvenioBuscar->obtenerDatConvenioDadoId($idconvenio);
	   $objDatConvenio->numeroconvenio = $numeroconvenio;
	   $objDatConvenio->denominacion = $denominacion;
       $objDatConvenio->idobra = $idobra;
	   $objDatConvenio->porcientoejecucion = $porcientoejecucion;
	   $objDatConvenio->salario = $salario;
	   $objDatConvenio->penalizacion = $penalizacion;
	   $objDatConvenio->fechainicio = $fechainicio;
	   $objDatConvenio->fechafin = $fechafin;
	   $objDatConvenio->descripcion = $descripcion;
	   $objDatConvenio->identidad = $identidad;
	   $objDatConvenio->save();
	}
	
	public function eliminarConvenio($idconvenio){
	   $objDatConvenioBuscar = new DatConvenio();
	   $objDatConvenio = $objDatConvenioBuscar->obtenerDatConvenioDadoId($idconvenio);
	   $objDatConvenio->delete();
	   return 'DEL';
	}
	
	public function deleteModeloConvenio($arrayidmodeloconvenio, $tipoconvenio)
    {
        if ($tipoconvenio == 1) {
            foreach ($arrayidmodeloconvenio as $i => $value) {
                $objDatModeloConvenioIndividual = new DatModeloConvenioIndividual();
                $objEliminar = $objDatModeloConvenioIndividual->obtenerDatModeloConvenioIndDadoId($value);
                $objEliminar->delete();
            }
            return "ok";
        } else {
            foreach ($arrayidmodeloconvenio as $i => $value) {
                $objDatModeloConvenioColectivo = new DatModeloConvenioColectivo();
                $objEliminar = $objDatModeloConvenioColectivo->obtenerDatModeloConvenioColectivoDadoId($value);
                $objEliminar->delete();
            }
            return "ok";
        }
    }

      public function aprobarConvenio($idconvenio){
          $objDomain = Doctrine::getTable('DatConvenio')->find($idconvenio);
          $objDomain->aprobado = 1;
          $objDomain->save();
          return 'ok';
      }
}
