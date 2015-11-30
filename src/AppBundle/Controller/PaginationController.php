<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use AppBundle\Entity\CompaniesRepository;
/**
 * @Template()
 */
class PaginationController extends Controller{
    /**
     * @Route("/page/{i}/{name}/{tip}/{ts}",name="page")
     */
    function paginationAction($i,$name,$tip,$ts=null){
         $menuRepository = $this->getDoctrine()
                ->getManager()
                ->getRepository('AppBundle:Menu');
        $menu['result'] = $menuRepository->showAction();
        
        $connect = $this->get('database_connection');
        
         $nn = $i;
         $nn--;
         $rezult = $connect->fetchAll('select * from '.$name);
                $count = 0;
              foreach($rezult as $item){
                  $count++;
              }
              $rez= $count/12;
               $m=$i-1;
               $m=$m*12;if($m>0){
               $m--;}
        if($tip == 'names'){
            if($ts == null){
                 $company['rezult']= $connect->fetchAll('select * from '.$name.'  LIMIT 12 OFFSET '.$m);
            }else{
            $company['rezult']= $connect->fetchAll('select * from '.$name.' Order By `Nm` '.$ts.'  LIMIT 12 OFFSET '.$m);}
             if($name == 'companies'){
                $data = [
                   'name'=>$name,
                   'menu'=>$menu['result'],
                   'tip'=>$tip,
                   'ts'=>$ts,
                   'a'=>++$i,
                   'b'=>$nn,
                   'companies' => $company['rezult'],
                   'count' =>  ceil($rez),
                 ];
             }else if($name == 'items'){
                $data = [
                   'name'=>$name,
                   'menu'=>$menu['result'],
                   'tip'=>$tip,
                   'ts'=>$ts,
                   'a'=>++$i,
                   'b'=>$nn,
                   'items' => $company['rezult'],
                   'count' =>  ceil($rez),
                 ]; 
             }else{
               $data = [
                   'name'=>$name,
                   'menu'=>$menu['result'],
                   'tip'=>$tip,
                   'ts'=>$ts,
                   'a'=>++$i,
                   'b'=>$nn,
                   'articles' => $company['rezult'],
                   'count' =>  ceil($rez), 
               ];
             }
        }
        else{
           if($ts == null){
                 $company['rezult']= $connect->fetchAll('select * from '.$name.'  LIMIT 12 OFFSET '.$m);
            }else{
            $company['rezult']= $connect->fetchAll('select * from '.$name.' Order By `SalePrice` '.$ts.'  LIMIT 12 OFFSET '.$m);}
             if($name == 'items'){
                $data = [
                   'name'=>$name,
                   'menu'=>$menu['result'],
                   'tip'=>$tip,
                   'ts'=>$ts,
                   'a'=>++$i,
                   'b'=>$nn,
                   'items' => $company['rezult'],
                   'count' =>  ceil($rez),
                 ]; 
             }
        }
        return $this->render('AppBundle:Default:index2.html.twig',compact('data'));
    }
}