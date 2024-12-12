
import csv
from fastapi import APIRouter, HTTPException
from decimal import Decimal
import time

import boto3
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
from datetime import datetime, timezone, timedelta


resource = boto3.resource('dynamodb', region_name='ap-northeast-2')
dynamodb = boto3.client('dynamodb', region_name='ap-northeast-2')  # 리전 설정


router = APIRouter()

def get_current_log(resource_type) :
    table = resource.Table(resource_type)
        # 현재 시간 가져오기
    # 현재 시간 가져오기
    current_time = time.time()  # 현재 Unix Timestamp

    # 타임스탬프 범위 설정 (예: 최근 1시간 데이터)
    start_time = Decimal(str(int(current_time - (60 * 60 * 300))))  # 1시간 전
    end_time = Decimal(str(int(current_time)))               # 현재 시간

    response = table.scan(
        FilterExpression=Attr('sort_key').between(start_time, end_time)
    )
    sorted_items = sorted(response['Items'], key=lambda x: x['sort_key'])

    return sorted_items

def get_current_process(resource_type) :
    table = resource.Table(resource_type)
    # 현재 시간 가져오기
    current_time = time.time()  # 현재 Unix Timestamp

    # 타임스탬프 범위 설정 (예: 최근 1시간 데이터)
    start_time = Decimal(str(int(current_time - (60 * 60 * 300))))  # 1시간 전
    end_time = Decimal(str(int(current_time)))               # 현재 시간

    response = table.scan(
        FilterExpression=Attr('sort_key').between(start_time, end_time)
    )
    sorted_items = sorted(response['Items'], key=lambda x: x['sort_key'])[-1]

    return sorted_items


def convert_unix_to_korean_time(unix_timestamp):
    # 문자열을 정수로 변환
    unix_timestamp = float(unix_timestamp)
    # UTC에서 9시간을 더해 한국 시간으로 변환
    korean_time = datetime.fromtimestamp(unix_timestamp, tz=timezone.utc) + timedelta(hours=9)
    return korean_time.strftime('%Y-%m-%d %H:%M:%S')  # 초까지 포함

def get_cpu() :
    data = get_current_log("resource_1")
    cpu_usage = []
    time_stamp = []
    for i in data : 
        cpu_usage.append(i['cpu_percent'])
        time_stamp.append(convert_unix_to_korean_time(i['time_stamp']))
        #print(cpu_usage, time_stamp)

    return [float(x) for x in cpu_usage], time_stamp 

def get_process() :
    data = get_current_process("resource_1_process")
    
    
    percent = []
    p_name = []


    for i in range(1,6) : 
        t, pid, pname, val = data[f"p{i}"].split(",")[:4]
        percent.append(val)
        p_name.append(pname)

    return [float(x) for x in percent], p_name



@router.get("/data_response")
async def get_chart_data():
    usage, time_stamp = get_cpu()
    return {
        "labels": time_stamp,
        "values": usage,
    }

@router.get("/process_response")
async def get_pie_data():

    percent, p_name = get_process()
    return {
        "labels": p_name,
        "values": percent,
    }



