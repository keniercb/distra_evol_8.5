<?php
class ZendExt_Soporte_Rtf {
	private $rtf;
	public function __construct($fuente) {
		$this->rtf=$this->Leer_Plantilla($fuente);
	}
	function Leer_Plantilla($fuente){
		$texto=file($fuente);
		$todo="";
		$cant=sizeof($texto);
		for($i=0;$i<$cant;$i++)
		{
		$todo=$todo.$texto[$i];
		}
		$matriz=explode("sectd",$todo);
		$cabecera=$matriz[0]."sectd";
		$inicio=strlen($cabecera);
		$final=strrpos($todo,"}");
		$largo=$final-$inicio;
		$cuerpo=substr($todo,$inicio,$largo);
		$devolver = array($cabecera,$cuerpo);
		return $devolver;
	}
	public function Modificar_Planilla($equivalencias){
		$resultado = "";
		$cuerpo = $this->rtf[1];
		$cant = sizeof($equivalencias);
		for ($i=1;$i<$cant;$i++){
			$cuerpoaux = $cuerpo;
			//---Cambiar los valores
			$cant1 = sizeof($equivalencias[$i]);
			for ($j=0;$j<$cant1;$j++){	
				$cuerpoaux=str_replace($equivalencias[0][$j],$equivalencias[$i][$j],$cuerpoaux);
			}
			//---Escribir el cuerpo del documento
			$resultado.=$cuerpoaux;
			if($cant >$i+1){
				$resultado.= "\\par \\page \\par";
			}
		}
		//---Finalizar el documento
		$resultado.="}";
		$this->rtf[1]=$resultado;
	} 
	public function Listar($coleccion,$delimitador){
		$cuerpo = $this->rtf[1];
		//---Preparar la salida
		$resultado = "";
		//---Dividir el cuerpo
		$a=strpos($cuerpo,$delimitador)+1;
		$b=strrpos($cuerpo,$delimitador);
		$cant=$b-$a;
		$rep=substr($cuerpo,$a,$cant);
		$matriz=explode($rep,$cuerpo);
		$antes = $matriz[0];
		$despues = $matriz[1];		
		//---Escribir Documento antes de Lista
		$cant = strlen($antes)-1;
		$antes = substr($antes,0,$cant);
		$resultado .= $antes;
		//---Escribir Lista
		$cant= sizeof($coleccion);
		for($i=1;$i<$cant;$i++){
			$aux = $rep;
			$cant1=sizeof($coleccion[$i]);
			for($j=0;$j<$cant1;$j++){
				$aux = str_replace($coleccion[0][$j],$coleccion[$i][$j],$aux);
			}
			$resultado .= $aux;
		}
		//---Escribir Documento des[ues de lista
		$cant = strlen($despues)-1;
		$despues = substr($despues,1,$cant);
		$resultado .= $despues;
		$this->rtf[1]=$resultado;
	}
	public function Salvar($destino="SinNombre.doc")
	{
		$punt=fopen($destino,"w");
		fputs($punt,$this->rtf[0]);
		fputs($punt,$this->rtf[1]);
		fputs($punt,"}");
		fclose($punt);
	}
}


